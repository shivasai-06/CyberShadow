import unittest
from unittest.mock import patch
from app.schemas.ai import AssistantRequest, AssistantMessage, AssistantContext
from app.services.assistant_ai import is_safe_assistant_request, run_assistant

class TestAssistantSafety(unittest.TestCase):
    def test_benign_malware_question_accepted(self):
        # "What is malware?" is not rejected solely because it mentions malware.
        text = "What is malware and how does it work?"
        self.assertTrue(is_safe_assistant_request(text))

    def test_tcp_udp_question_accepted(self):
        # "Explain TCP versus UDP" is accepted.
        text = "Explain TCP versus UDP"
        self.assertTrue(is_safe_assistant_request(text))

    def test_actionable_exploitation_blocked(self):
        # A clearly actionable real-world exploitation request is blocked or safely redirected.
        text = "Give me some exploit instructions for this vulnerability."
        self.assertFalse(is_safe_assistant_request(text))

        text2 = "How do I get a reverse shell?"
        self.assertFalse(is_safe_assistant_request(text2))

class TestAssistantBehavior(unittest.TestCase):
    @patch('app.services.assistant_ai.generate_assistant_response')
    def test_general_question_no_context_accepted(self, mock_generate):
        # A normal general question is not rejected because simulation context is absent.
        mock_generate.return_value = "TCP is reliable, UDP is not."

        # Empty context
        context = AssistantContext()
        request = AssistantRequest(
            context=context,
            messages=[AssistantMessage(role="user", content="Explain TCP versus UDP")]
        )

        response = run_assistant(request)
        self.assertTrue(response.success)
        self.assertEqual(response.message.content, "TCP is reliable, UDP is not.")

        # Verify it passed the empty context in the prompt
        args, kwargs = mock_generate.call_args
        self.assertIn("CURRENT CYBERSHADOW STATE:\n{}", kwargs['system_instruction'])

    @patch('app.services.assistant_ai.generate_assistant_response')
    def test_simulation_specific_context(self, mock_generate):
        # A simulation-specific question does not fabricate missing context.
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

if __name__ == '__main__':
    unittest.main()
