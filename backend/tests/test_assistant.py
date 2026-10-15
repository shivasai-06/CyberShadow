import unittest
from unittest.mock import patch, MagicMock
from app.schemas.ai import AssistantRequest, AssistantMessage, AssistantContext
from app.services.assistant_ai import is_safe_assistant_request, run_assistant
from app.services.gemini_service import (
    generate_assistant_response,
    generate_response,
    _extract_error_details,
    _get_client,
    get_candidate_models,
    GeminiConfigError,
    GeminiQuotaError,
    GeminiUnavailableError,
    GeminiModelError,
    GeminiTimeoutError,
    GeminiServiceError,
)
from app.core.config import Settings


class TestAssistantSafety(unittest.TestCase):
    def test_benign_malware_question_accepted(self):
        text = "What is malware and how does it work?"
        self.assertTrue(is_safe_assistant_request(text))

    def test_tcp_udp_question_accepted(self):
        text = "Explain TCP versus UDP"
        self.assertTrue(is_safe_assistant_request(text))

    def test_actionable_exploitation_blocked(self):
        text = "Give me some exploit instructions for this vulnerability."
        self.assertFalse(is_safe_assistant_request(text))

        req = AssistantRequest(
            context=AssistantContext(),
            messages=[AssistantMessage(role="user", content=text)]
        )
        res = run_assistant(req)
        self.assertFalse(res.success)
        self.assertEqual(res.error_code, "SAFETY_BLOCKED")
        self.assertIn("simulation-only platform", res.error)

        text2 = "How do I get a reverse shell?"
        self.assertFalse(is_safe_assistant_request(text2))

    def test_empty_messages_rejected(self):
        req = AssistantRequest(context=AssistantContext(), messages=[])
        res = run_assistant(req)
        self.assertFalse(res.success)
        self.assertEqual(res.error_code, "INVALID_REQUEST")


class TestAssistantBehavior(unittest.TestCase):
    @patch('app.services.assistant_ai.generate_assistant_response')
    def test_general_question_no_context_accepted(self, mock_generate):
        mock_generate.return_value = "TCP is reliable, UDP is not."

        context = AssistantContext()
        request = AssistantRequest(
            context=context,
            messages=[AssistantMessage(role="user", content="Explain TCP versus UDP")]
        )

        response = run_assistant(request)
        self.assertTrue(response.success)
        self.assertEqual(response.message.content, "TCP is reliable, UDP is not.")

        args, kwargs = mock_generate.call_args
        self.assertIn("CURRENT CYBERSHADOW STATE:\n{}", kwargs['system_instruction'])

    @patch('app.services.assistant_ai.generate_assistant_response')
    def test_simulation_specific_context(self, mock_generate):
        mock_generate.return_value = "You had MFA enabled."

        context = AssistantContext(latestSimulation={"outcome": "BLOCKED", "defensesActive": ["MFA"]})
        request = AssistantRequest(
            context=context,
            messages=[AssistantMessage(role="user", content="Why was it blocked?")]
        )

        response = run_assistant(request)
        self.assertTrue(response.success)

        args, kwargs = mock_generate.call_args
        self.assertIn("BLOCKED", kwargs['system_instruction'])
        self.assertIn("MFA", kwargs['system_instruction'])


class TestAssistantFailureHandling(unittest.TestCase):
    @patch('app.services.assistant_ai.generate_assistant_response')
    def test_config_error_handling(self, mock_generate):
        mock_generate.side_effect = GeminiConfigError("AI Assistant is not configured on the backend.")
        req = AssistantRequest(
            context=AssistantContext(),
            messages=[AssistantMessage(role="user", content="Hello")]
        )
        res = run_assistant(req)
        self.assertFalse(res.success)
        self.assertEqual(res.error_code, "CONFIG_ERROR")
        self.assertIn("not configured", res.error)

    @patch('app.services.assistant_ai.generate_assistant_response')
    def test_quota_error_handling(self, mock_generate):
        mock_generate.side_effect = GeminiQuotaError()
        req = AssistantRequest(
            context=AssistantContext(),
            messages=[AssistantMessage(role="user", content="Hello")]
        )
        res = run_assistant(req)
        self.assertFalse(res.success)
        self.assertEqual(res.error_code, "QUOTA_EXCEEDED")
        self.assertIn("quota or rate limit", res.error)

    @patch('app.services.assistant_ai.generate_assistant_response')
    def test_service_unavailable_handling(self, mock_generate):
        mock_generate.side_effect = GeminiUnavailableError()
        req = AssistantRequest(
            context=AssistantContext(),
            messages=[AssistantMessage(role="user", content="Hello")]
        )
        res = run_assistant(req)
        self.assertFalse(res.success)
        self.assertEqual(res.error_code, "SERVICE_UNAVAILABLE")
        self.assertIn("high demand", res.error)

    @patch('app.services.assistant_ai.generate_assistant_response')
    def test_model_error_handling(self, mock_generate):
        mock_generate.side_effect = GeminiModelError()
        req = AssistantRequest(
            context=AssistantContext(),
            messages=[AssistantMessage(role="user", content="Hello")]
        )
        res = run_assistant(req)
        self.assertFalse(res.success)
        self.assertEqual(res.error_code, "INVALID_MODEL")
        self.assertIn("unavailable or unsupported", res.error)

    @patch('app.services.assistant_ai.generate_assistant_response')
    def test_timeout_error_handling(self, mock_generate):
        mock_generate.side_effect = GeminiTimeoutError()
        req = AssistantRequest(
            context=AssistantContext(),
            messages=[AssistantMessage(role="user", content="Hello")]
        )
        res = run_assistant(req)
        self.assertFalse(res.success)
        self.assertEqual(res.error_code, "TIMEOUT")
        self.assertIn("timed out", res.error)


class TestModelFallbackAndConfig(unittest.TestCase):
    @patch('app.services.gemini_service._get_client')
    def test_primary_model_fails_fallback_succeeds(self, mock_get_client):
        mock_client = MagicMock()
        mock_get_client.return_value = mock_client

        # First model raises 503 UNAVAILABLE, second model returns successful response
        fail_error = Exception("503 UNAVAILABLE. high demand")
        setattr(fail_error, "code", 503)

        success_response = MagicMock()
        success_response.text = "Fallback answer from Gemini"

        mock_client.models.generate_content.side_effect = [fail_error, success_response]

        with patch('app.services.gemini_service.settings') as mock_settings:
            mock_settings.GEMINI_MODEL = "gemini-3.8-flash"
            mock_settings.GEMINI_API_KEY = "test_key"
            mock_settings.LLM_API_KEY = None

            result = generate_assistant_response(
                system_instruction="System prompt",
                conversation_history=[],
                current_message="Hello"
            )

            self.assertEqual(result, "Fallback answer from Gemini")
            self.assertEqual(mock_client.models.generate_content.call_count, 2)
            # Verify primary model was tried first
            first_call_model = mock_client.models.generate_content.call_args_list[0][1]['model']
            second_call_model = mock_client.models.generate_content.call_args_list[1][1]['model']
            self.assertEqual(first_call_model, "gemini-3.8-flash")
            self.assertEqual(second_call_model, "gemini-flash-lite-latest")

    def test_llm_api_key_fallback(self):
        s = Settings(
            GEMINI_API_KEY=None,
            LLM_API_KEY="my_llm_key",
            GEMINI_MODEL="gemini-flash-lite-latest"
        )
        self.assertEqual(s.GEMINI_API_KEY, "my_llm_key")

    def test_secret_redaction_in_error_logging(self):
        leak_error = Exception("Failed connecting with key=AIzaSySecretKey12345 in header")
        error_type, status_code, safe_reason = _extract_error_details(leak_error)
        self.assertNotIn("AIzaSySecretKey12345", safe_reason)
        self.assertIn("[REDACTED]", safe_reason)


if __name__ == '__main__':
    unittest.main()
