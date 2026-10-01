import type { SimulationScenario } from '../types/simulation';

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'sc_phishing',
    name: 'PHISHING → ACCOUNT TAKEOVER',
    difficulty: 'BEGINNER',
    category: 'SOCIAL ENGINEERING',
    description: 'See how a fictional phishing message can lead to credential exposure and account compromise when defensive controls are weak.',
    estimatedTime: '~60 SECONDS',
    controlsInvolved: ['MFA', 'PASSWORD STRENGTH', 'SECURITY AWARENESS'],
    severity: 'HIGH',
    steps: [
      { 
        id: 's1', 
        name: 'MESSAGE', 
        description: 'A simulated phishing email arrives in the fictional inbox.', 
        learningContext: 'Attackers often begin with broad social engineering campaigns to find a weak entry point.',
        decision: {
          id: 'dec_phishing_1',
          title: 'You receive an unexpected login message.',
          situation: 'An email arrives asking you to urgently log in and verify your account details.',
          explanation: 'Unexpected urgent requests are a common tactic in social engineering.',
          options: [
            {
              id: 'opt_phishing_risky',
              label: 'Open the link and sign in',
              description: 'Click the link provided in the email and enter your credentials.',
              isProtective: false,
              consequenceMessage: 'Opening the unexpected link allowed the fictional attack path to continue.',
              effect: {
                action: 'continue',
                message: 'The user interacted with the phishing link.'
              }
            },
            {
              id: 'opt_phishing_protective',
              label: 'Verify the message through an independent trusted channel',
              description: 'Do not click the link. Contact the supposed sender directly via a known channel.',
              isProtective: true,
              consequenceMessage: 'Verifying the request independently interrupted the simulated phishing attempt before credentials were exposed.',
              effect: {
                action: 'block',
                message: 'The user identified the phishing attempt and did not interact.',
                impactLevel: 'LOW',
                finalOutcome: 'PHISHING IDENTIFIED',
                overrideStep: {
                  name: 'ATTACK BLOCKED',
                  description: 'The simulated user ignored the phishing link.',
                  learningContext: 'Verifying unexpected requests is safer than blindly interacting with them.'
                }
              }
            }
          ]
        }
      },
      { id: 's2', name: 'USER INTERACTION', description: 'The fictional user interacted with the simulated phishing message.', learningContext: 'Human interaction can become an important point in a simulated attack path.' },
      { id: 's3', name: 'FAKE LOGIN', description: 'The user is directed to a simulated fake login portal.', learningContext: 'Deceptive login pages are designed to harvest credentials silently.' },
      { id: 's4', name: 'CREDENTIAL EXPOSURE', description: 'The fictional credentials have been exposed to the simulated adversary.', learningContext: 'Exposed credentials are the primary enabler of account takeover if no other defenses exist.' },
      { 
        id: 's5', 
        name: 'ACCOUNT TAKEOVER', 
        description: 'The simulated adversary uses the credentials to access the account.', 
        learningContext: 'Without secondary authentication, a password breach leads directly to compromise.', 
        checkpoint: {
          control: 'mfa',
          onActive: {
            action: 'block',
            message: 'MFA added an additional verification step, so the stolen fictional credentials were not enough to complete the simulated account takeover.',
            impactLevel: 'LOW',
            finalOutcome: 'ATTACK BLOCKED',
            overrideStep: {
              name: 'MFA CHALLENGE',
              description: 'The simulated adversary is prompted for an MFA token which they do not have.',
              learningContext: 'MFA provides a critical barrier even when passwords are stolen.'
            }
          },
          onInactive: {
            action: 'continue',
            message: 'Without MFA, the password breach led directly to account access.'
          }
        }
      }
    ],
    successResult: {
      title: 'ATTACK BLOCKED',
      description: 'The simulated credential exposure reached an MFA checkpoint and the fictional attack path was stopped.',
      keyFactor: 'MFA',
      learningFeedback: {
        whatHappened: 'A fictional user fell for a phishing email and exposed their password.',
        whyItHappened: 'Social engineering manipulated the user into entering credentials on a fake page.',
        whatStoppedIt: 'Multi-Factor Authentication (MFA) blocked the login because the attacker did not have the second factor.',
        keyLesson: 'MFA protects your identity even when your password is compromised.'
      }
    },
    blockedResult: {
      title: 'SIMULATED COMPROMISE',
      description: 'The fictional attack path reached the account because the simulated identity lacked an additional authentication control.',
      keyFactor: 'MFA',
      learningFeedback: {
        whatHappened: 'A fictional user fell for a phishing email and exposed their password.',
        whyItHappened: 'The password was the only barrier to entry, so exposing it led directly to compromise.',
        whatCouldHaveHelped: 'Enable Multi-Factor Authentication (MFA) to require a second form of verification.',
        keyLesson: 'Passwords alone are no longer sufficient to protect critical accounts.'
      }
    }
  },
  {
    id: 'sc_attachment',
    name: 'MALICIOUS ATTACHMENT',
    difficulty: 'INTERMEDIATE',
    category: 'ENDPOINT SECURITY',
    description: 'Explore how a fictional malicious attachment can move from user interaction toward endpoint exposure.',
    estimatedTime: '~60 SECONDS',
    controlsInvolved: ['AUTOMATIC UPDATES', 'SECURITY AWARENESS'],
    severity: 'HIGH',
    steps: [
      { id: 'a1', name: 'EMAIL', description: 'A simulated email containing a malicious attachment arrives.', learningContext: 'Attachments are common vectors for delivering malware.' },
      { 
        id: 'a2', 
        name: 'USER REVIEW', 
        description: 'The user reviews the email.', 
        learningContext: 'Awareness training helps users identify suspicious emails.',
        decision: {
          id: 'dec_attachment_1',
          title: 'An unexpected document arrives from an unknown sender.',
          situation: 'An email with an attached invoice arrives from an address you don\'t recognize.',
          explanation: 'Malicious attachments often masquerade as normal business documents.',
          options: [
            {
              id: 'opt_attach_risky',
              label: 'Open the attachment',
              description: 'Download and open the attached document to see what it is.',
              isProtective: false,
              consequenceMessage: 'Opening the unexpected attachment allowed the fictional attack path to continue.',
              effect: { action: 'continue', message: 'User opened the suspicious attachment.' }
            },
            {
              id: 'opt_attach_protective',
              label: 'Verify the sender and report the attachment',
              description: 'Do not open the file. Report it to the security team.',
              isProtective: true,
              consequenceMessage: 'Reporting the unexpected attachment interrupted the simulated attack before the file could execute.',
              effect: {
                action: 'block',
                message: 'The user reported the suspicious attachment.',
                impactLevel: 'LOW',
                finalOutcome: 'ATTACHMENT REPORTED',
                overrideStep: {
                  name: 'ATTACK BLOCKED',
                  description: 'The simulated user reported the attachment without opening it.',
                  learningContext: 'Reporting suspicious files stops attacks at the perimeter.'
                }
              }
            }
          ]
        },
        checkpoint: {
          control: 'security_awareness',
          onActive: {
            action: 'block',
            message: 'Security awareness training empowered the simulated user to identify and report the suspicious activity.',
            impactLevel: 'LOW',
            finalOutcome: 'ATTACK BLOCKED',
            overrideStep: {
              name: 'REPORTED AS PHISHING',
              description: 'The simulated user identified the email as suspicious and reported it.',
              learningContext: 'Security awareness turns end users into an active line of defense.'
            }
          },
          onInactive: {
            action: 'continue',
            message: 'The user failed to recognize the phishing attempt and proceeded.'
          }
        }
      },
      { id: 'a3', name: 'ATTACHMENT', description: 'The attachment is downloaded to the local device.', learningContext: 'File-based threats often require user execution to activate.' },
      { id: 'a4', name: 'USER OPENS FILE', description: 'The fictional user opens the simulated attachment.', learningContext: 'Executing unknown files bypasses initial perimeter defenses.' },
      { 
        id: 'a5', 
        name: 'SIMULATED IMPACT', 
        description: 'The fictional malware exploits an unpatched vulnerability to achieve persistence.', 
        learningContext: 'Without adequate endpoint controls, devices can become fully compromised.', 
        checkpoint: {
          control: 'automatic_updates',
          onActive: {
            action: 'block',
            message: 'Automatic updates patched the known fictional vulnerability, blocking the simulated malware execution.',
            impactLevel: 'LOW',
            finalOutcome: 'ATTACK BLOCKED',
            overrideStep: {
              name: 'EXPLOIT BLOCKED',
              description: 'The simulated malware failed to execute because the endpoint vulnerability was already patched.',
              learningContext: 'Automatic updates eliminate known vulnerabilities before they can be exploited.'
            }
          },
          onInactive: {
            action: 'continue',
            message: 'An outdated system allowed the simulated malware to execute successfully.'
          }
        }
      }
    ],
    successResult: {
      title: 'ATTACK BLOCKED',
      description: 'The simulated endpoint protection or user awareness stopped the threat.',
      keyFactor: 'DEFENSE CONTROL',
      learningFeedback: {
        whatHappened: 'A simulated malicious attachment attempted to execute on the endpoint.',
        whyItHappened: 'Email filtering did not catch the malicious attachment.',
        whatStoppedIt: 'Active defenses blocked the user from running it, or the endpoint was patched against the exploit.',
        keyLesson: 'Defense-in-depth ensures that if one layer fails, another can stop the attack.'
      }
    },
    blockedResult: {
      title: 'SIMULATED COMPROMISE',
      description: 'The fictional attack path infected the endpoint because the simulated device lacked strict execution controls or patching.',
      keyFactor: 'EXECUTION CONTROL',
      learningFeedback: {
        whatHappened: 'A simulated malicious attachment executed and compromised the endpoint.',
        whyItHappened: 'The user interacted with the payload, and the system lacked the patches to prevent the exploit.',
        whatCouldHaveHelped: 'Security Awareness to prevent clicking, or Automatic Updates to patch the vulnerability.',
        keyLesson: 'Unpatched endpoints are highly vulnerable to user-initiated malware execution.'
      }
    }
  },
  {
    id: 'sc_password',
    name: 'WEAK PASSWORD',
    difficulty: 'BEGINNER',
    category: 'IDENTITY SECURITY',
    description: 'Understand how weak authentication controls can increase the simulated risk of account compromise.',
    estimatedTime: '~45 SECONDS',
    controlsInvolved: ['PASSWORD STRENGTH', 'MFA'],
    severity: 'MEDIUM',
    steps: [
      { id: 'p1', name: 'USER REGISTRATION', description: 'The fictional user creates an account.', learningContext: 'Account creation is the first point of securing an identity.' },
      { 
        id: 'p2', 
        name: 'WEAK PASSWORD CREATED', 
        description: 'The fictional user sets a weak password (e.g., Password123).', 
        learningContext: 'Weak passwords are easily guessable or crackable.',
        decision: {
          id: 'dec_password_1',
          title: 'Choose a password strategy.',
          situation: 'You are setting up a new account for a critical system.',
          explanation: 'Authentication strength directly determines the difficulty of an attack.',
          options: [
            {
              id: 'opt_pwd_risky',
              label: 'Use a short memorable password',
              description: 'Use a simple password you can easily remember without a tool.',
              isProtective: false,
              consequenceMessage: 'Choosing a weak password allowed the simulated attack to guess it quickly.',
              effect: { action: 'continue', message: 'User opted for a weak password.' }
            },
            {
              id: 'opt_pwd_protective',
              label: 'Use a strong unique password',
              description: 'Generate a long, random password and store it securely.',
              isProtective: true,
              consequenceMessage: 'Choosing a strong, unique password interrupted the simulated brute-force attack.',
              effect: {
                action: 'block',
                message: 'The user generated a strong, complex password.',
                impactLevel: 'LOW',
                finalOutcome: 'ATTACK BLOCKED',
                overrideStep: {
                  name: 'PASSWORD SECURED',
                  description: 'The user proactively chose a strong password.',
                  learningContext: 'Strong passwords are the first line of defense against credential stuffing.'
                }
              }
            }
          ]
        },
        checkpoint: {
          control: 'password_strength',
          onActive: {
            action: 'block',
            message: 'A strong password policy prevented the simulated brute force attack from succeeding by enforcing complexity.',
            impactLevel: 'LOW',
            finalOutcome: 'ATTACK BLOCKED',
            overrideStep: {
              name: 'STRONG PASSWORD ENFORCED',
              description: 'The user was forced to create a strong, complex password.',
              learningContext: 'Password strength requirements prevent easily guessable credentials.'
            }
          },
          onInactive: {
            action: 'continue',
            message: 'The lack of complexity rules allowed a highly guessable password.'
          }
        }
      },
      { id: 'p3', name: 'LOGIN ATTEMPT', description: 'A simulated adversary attempts to guess the password.', learningContext: 'Brute force and credential stuffing attacks exploit weak passwords.' },
      { id: 'p4', name: 'AUTHENTICATION', description: 'The simulated password guess is successful.', learningContext: 'Without complexity requirements, passwords offer minimal protection.' },
      { id: 'p5', name: 'SIMULATED COMPROMISE', description: 'The fictional account is compromised.', learningContext: 'A single point of failure in authentication leads to compromise.' }
    ],
    successResult: {
      title: 'ATTACK BLOCKED',
      description: 'The simulated adversary could not guess the strong password.',
      keyFactor: 'PASSWORD STRENGTH',
      learningFeedback: {
        whatHappened: 'A simulated brute force attack attempted to guess the user\'s password.',
        whyItHappened: 'Automated attacks regularly test common passwords against login portals.',
        whatStoppedIt: 'Password complexity requirements ensured the password was mathematically difficult to guess.',
        keyLesson: 'Strong, unique passwords are a fundamental defense against credential stuffing.'
      }
    },
    blockedResult: {
      title: 'SIMULATED COMPROMISE',
      description: 'The fictional attack path succeeded because the weak password was easily cracked.',
      keyFactor: 'PASSWORD STRENGTH',
      learningFeedback: {
        whatHappened: 'A simulated brute force attack successfully guessed the user\'s password.',
        whyItHappened: 'The password was too short or too common, allowing automated tools to discover it quickly.',
        whatCouldHaveHelped: 'Enforce strong password policies or use a password manager.',
        keyLesson: 'Weak passwords provide an illusion of security and are easily bypassed.'
      }
    }
  },
  {
    id: 'sc_cloud',
    name: 'CLOUD DATA EXPOSURE',
    difficulty: 'INTERMEDIATE',
    category: 'CLOUD SECURITY',
    description: 'Simulate how misconfigured cloud storage can lead to data exposure.',
    estimatedTime: '~50 SECONDS',
    controlsInvolved: ['PRIVACY', 'BACKUP'],
    severity: 'CRITICAL',
    steps: [
      { id: 'c1', name: 'CLOUD BUCKET CREATED', description: 'A fictional cloud storage bucket is created for project files.', learningContext: 'Cloud resources require explicit access configurations.' },
      { 
        id: 'c2', 
        name: 'PERMISSIONS MISCONFIGURED', 
        description: 'The bucket is accidentally set to public read access.', 
        learningContext: 'Misconfigurations are a leading cause of cloud data breaches.',
        decision: {
          id: 'dec_cloud_1',
          title: 'How should this fictional storage resource be configured?',
          situation: 'You are deploying a new cloud storage bucket containing internal data.',
          explanation: 'Access policies determine who can read the data from the internet.',
          options: [
            {
              id: 'opt_cloud_risky',
              label: 'Allow public access',
              description: 'Configure the bucket so anyone with the link can view files.',
              isProtective: false,
              consequenceMessage: 'Allowing public access created a direct path for data exposure.',
              effect: { action: 'continue', message: 'User allowed public access.' }
            },
            {
              id: 'opt_cloud_protective',
              label: 'Restrict access to authorized users',
              description: 'Require authentication and explicitly grant access.',
              isProtective: true,
              consequenceMessage: 'Restricting access prevented unauthorized data discovery.',
              effect: {
                action: 'block',
                message: 'The user enforced strict access controls.',
                impactLevel: 'LOW',
                finalOutcome: 'DATA SECURED',
                overrideStep: {
                  name: 'PROPER CONFIGURATION',
                  description: 'The user applied least privilege access controls.',
                  learningContext: 'Secure defaults prevent accidental cloud exposure.'
                }
              }
            }
          ]
        },
        checkpoint: {
          control: 'privacy',
          onActive: {
            action: 'block',
            message: 'Strict privacy controls prevented the simulated adversary from accessing data by enforcing secure defaults.',
            impactLevel: 'LOW',
            finalOutcome: 'ATTACK BLOCKED',
            overrideStep: {
              name: 'PRIVACY AUDIT PASSED',
              description: 'Strict privacy controls flagged and corrected the public access setting automatically.',
              learningContext: 'Automated privacy and compliance checks prevent accidental exposure.'
            }
          },
          onInactive: {
            action: 'continue',
            message: 'Without privacy audits, the misconfiguration went unnoticed.'
          }
        }
      },
      { id: 'c3', name: 'DATA DISCOVERY', description: 'Automated simulated scanners discover the open bucket.', learningContext: 'Adversaries constantly scan the internet for exposed cloud resources.' },
      { id: 'c4', name: 'DATA DOWNLOAD', description: 'Sensitive fictional data is downloaded by the adversary.', learningContext: 'Once discovered, exposed data is rapidly exfiltrated.' },
      { id: 'c5', name: 'SIMULATED COMPROMISE', description: 'Fictional sensitive data is exposed.', learningContext: 'Lack of privacy controls leads directly to data breaches.' }
    ],
    successResult: {
      title: 'ATTACK BLOCKED',
      description: 'Privacy controls corrected the misconfiguration before the data could be discovered.',
      keyFactor: 'PRIVACY',
      learningFeedback: {
        whatHappened: 'A cloud storage bucket was briefly misconfigured to allow public access.',
        whyItHappened: 'Human error during deployment caused a misconfiguration.',
        whatStoppedIt: 'Privacy auditing tools immediately detected and remediated the exposure.',
        keyLesson: 'Automated guardrails are necessary because human configuration errors are inevitable.'
      }
    },
    blockedResult: {
      title: 'SIMULATED COMPROMISE',
      description: 'The fictional data was exposed due to a lack of privacy auditing.',
      keyFactor: 'PRIVACY',
      learningFeedback: {
        whatHappened: 'A misconfigured cloud storage bucket was discovered by an automated scanner, leading to data exposure.',
        whyItHappened: 'The bucket was mistakenly set to public, and no automated tools were monitoring for this.',
        whatCouldHaveHelped: 'Implement Privacy controls and cloud posture management tools.',
        keyLesson: 'Cloud misconfigurations are exploited incredibly fast by automated scanning tools.'
      }
    }
  },
  {
    id: 'sc_social',
    name: 'SOCIAL ENGINEERING',
    difficulty: 'ADVANCED',
    category: 'SOCIAL ENGINEERING',
    description: 'Experience a simulated targeted social engineering attack (spear-phishing).',
    estimatedTime: '~70 SECONDS',
    controlsInvolved: ['SECURITY AWARENESS', 'PRIVACY'],
    severity: 'HIGH',
    steps: [
      { 
        id: 'se1', 
        name: 'RECONNAISSANCE', 
        description: 'The adversary gathers open-source intelligence on the target.', 
        learningContext: 'Attackers use public information to craft convincing lures.',
        checkpoint: {
          control: 'privacy',
          onActive: {
            action: 'block',
            message: 'Privacy controls limited public information, thwarting the targeted lure creation.',
            impactLevel: 'LOW',
            finalOutcome: 'ATTACK BLOCKED',
            overrideStep: {
              name: 'INFO HIDDEN',
              description: 'Privacy controls limited public information, thwarting the targeted lure creation.',
              learningContext: 'Minimizing digital footprint disrupts the reconnaissance phase.'
            }
          },
          onInactive: {
            action: 'continue',
            message: 'Extensive public information allowed the attacker to craft a highly targeted lure.'
          }
        }
      },
      { id: 'se2', name: 'SPEAR-PHISHING LURE', description: 'A highly customized simulated email is sent to the target.', learningContext: 'Personalized attacks are much harder to detect.' },
      { 
        id: 'se3', 
        name: 'USER INTERACTION', 
        description: 'The user is prompted to authorize a fraudulent fictional transaction.', 
        learningContext: 'Targeted attacks often seek direct financial or access authorization.',
        decision: {
          id: 'dec_social_1',
          title: 'Someone asks you to urgently provide sensitive information.',
          situation: 'A message appearing to be from your CEO urgently requests a wire transfer.',
          explanation: 'Attackers exploit authority and urgency to bypass critical thinking.',
          options: [
            {
              id: 'opt_soc_risky',
              label: 'Provide the requested information',
              description: 'Comply with the urgent request immediately.',
              isProtective: false,
              consequenceMessage: 'Providing the requested information allowed the simulated attack to continue.',
              effect: { action: 'continue', message: 'User complied with the fraudulent request.' }
            },
            {
              id: 'opt_soc_protective',
              label: 'Verify the request through a trusted channel',
              description: 'Call the supposed sender on a known good phone number to verify.',
              isProtective: true,
              consequenceMessage: 'Verifying the request independently interrupted the simulated social engineering attempt.',
              effect: {
                action: 'block',
                message: 'The user independently verified and rejected the fraudulent request.',
                impactLevel: 'LOW',
                finalOutcome: 'ATTACK BLOCKED',
                overrideStep: {
                  name: 'FRAUD DETECTED',
                  description: 'The user identified the request as fraudulent through out-of-band verification.',
                  learningContext: 'Independent verification defeats urgency and authority impersonation.'
                }
              }
            }
          ]
        },
        checkpoint: {
          control: 'security_awareness',
          onActive: {
            action: 'block',
            message: 'Security awareness training helped the user identify the fraudulent request and verify via a secondary channel.',
            impactLevel: 'LOW',
            finalOutcome: 'ATTACK BLOCKED',
            overrideStep: {
              name: 'FRAUD DETECTED',
              description: 'Security awareness training helped the user identify the fraudulent request and verify via a secondary channel.',
              learningContext: 'Awareness is critical for identifying out-of-band social engineering.'
            }
          },
          onInactive: {
            action: 'continue',
            message: 'The user trusted the highly personalized lure.'
          }
        }
      },
      { id: 'se4', name: 'AUTHORIZATION GRANTED', description: 'The user authorizes the fictional transaction.', learningContext: 'Without awareness, even sophisticated lures succeed.' },
      { id: 'se5', name: 'SIMULATED COMPROMISE', description: 'The fictional funds or access are transferred to the adversary.', learningContext: 'Social engineering bypasses technical controls by exploiting human trust.' }
    ],
    successResult: {
      title: 'ATTACK BLOCKED',
      description: 'Privacy controls or security awareness stopped the targeted attack.',
      keyFactor: 'DEFENSE CONTROL',
      learningFeedback: {
        whatHappened: 'An attacker attempted a highly targeted spear-phishing attack.',
        whyItHappened: 'Attackers target individuals with access to funds or sensitive systems.',
        whatStoppedIt: 'Limited public information (Privacy) or an alert user (Security Awareness) stopped the attack.',
        keyLesson: 'Defending against social engineering requires a combination of reducing your footprint and staying vigilant.'
      }
    },
    blockedResult: {
      title: 'SIMULATED COMPROMISE',
      description: 'The fictional social engineering attack succeeded due to lack of awareness and exposed public information.',
      keyFactor: 'SECURITY AWARENESS',
      learningFeedback: {
        whatHappened: 'An attacker successfully tricked a user into authorizing a fraudulent transaction.',
        whyItHappened: 'The attacker used publicly available information to craft a convincing, personalized lure.',
        whatCouldHaveHelped: 'Better Security Awareness training and stricter Privacy controls on public data.',
        keyLesson: 'Highly targeted social engineering is difficult to detect without a healthy sense of skepticism.'
      }
    }
  },
  {
    id: 'sc_ransomware',
    name: 'DATA LOSS',
    difficulty: 'ADVANCED',
    category: 'ENDPOINT SECURITY',
    description: 'Simulate the impact of destructive malware and the importance of recovery.',
    estimatedTime: '~60 SECONDS',
    controlsInvolved: ['BACKUP', 'AUTOMATIC UPDATES'],
    severity: 'CRITICAL',
    steps: [
      { id: 'r1', name: 'INITIAL ACCESS', description: 'Simulated malware gains execution on the endpoint.', learningContext: 'Malware often enters through unpatched vulnerabilities or phishing.' },
      { id: 'r2', name: 'PAYLOAD DEPLOYED', description: 'The destructive fictional payload is unpacked.', learningContext: 'Modern malware acts quickly once inside the environment.' },
      { id: 'r3', name: 'DATA ENCRYPTION', description: 'Fictional files are encrypted and rendered inaccessible.', learningContext: 'Destructive attacks aim to deny access to critical data.' },
      { 
        id: 'r4', 
        name: 'RECOVERY ATTEMPT', 
        description: 'The organization attempts to restore systems.', 
        learningContext: 'Recovery capabilities are the ultimate safety net.',
        decision: {
          id: 'dec_ransomware_1',
          title: 'How should recovery be prepared?',
          situation: 'You are planning the disaster recovery strategy for critical data.',
          explanation: 'Destructive attacks assume you have no other way to retrieve your data.',
          options: [
            {
              id: 'opt_ran_risky',
              label: 'No backup',
              description: 'Rely solely on primary storage without isolated copies.',
              isProtective: false,
              consequenceMessage: 'Having no backup resulted in catastrophic fictional data loss.',
              effect: { action: 'continue', message: 'User did not prepare a backup.' }
            },
            {
              id: 'opt_ran_protective',
              label: 'Maintain a separate backup',
              description: 'Keep offline or immutable backups of all critical systems.',
              isProtective: true,
              consequenceMessage: 'Maintaining a separate backup allowed the data to be fully restored.',
              effect: {
                action: 'recover',
                message: 'The user utilized offline backups to restore the data.',
                impactLevel: 'LOW',
                finalOutcome: 'DATA RECOVERED',
                overrideStep: {
                  name: 'SUCCESSFUL RESTORE',
                  description: 'Data was successfully restored from secure, isolated backups.',
                  learningContext: 'Secure backups negate the impact of destructive data loss.'
                }
              }
            }
          ]
        },
        checkpoint: {
          control: 'backup',
          onActive: {
            action: 'recover',
            message: 'Secure backups allowed rapid fictional recovery, negating the impact of the simulated data loss.',
            impactLevel: 'LOW',
            finalOutcome: 'DATA RECOVERED',
            overrideStep: {
              name: 'SUCCESSFUL RESTORE',
              description: 'Data was successfully restored from secure, isolated backups.',
              learningContext: 'Secure backups negate the impact of destructive data loss.'
            }
          },
          onInactive: {
            action: 'continue',
            message: 'Without backups, recovery was impossible.'
          }
        }
      },
      { id: 'r5', name: 'SIMULATED COMPROMISE', description: 'Data is permanently lost. Ransom demand presented.', learningContext: 'Without backups, organizations face catastrophic data loss.' }
    ],
    successResult: {
      title: 'DATA RECOVERED',
      description: 'The simulated data loss was mitigated through successful backup restoration.',
      keyFactor: 'BACKUP',
      learningFeedback: {
        whatHappened: 'Destructive malware encrypted local data, but it was successfully restored.',
        whyItHappened: 'Malware managed to bypass initial endpoint defenses.',
        whatStoppedIt: 'Offline, secure backups provided a clean copy of the data, rendering the ransomware ineffective.',
        keyLesson: 'A reliable, tested backup strategy is the ultimate defense against data loss.'
      }
    },
    blockedResult: {
      title: 'DATA LOSS',
      description: 'The fictional data was permanently lost due to a lack of secure backups.',
      keyFactor: 'BACKUP',
      learningFeedback: {
        whatHappened: 'Destructive malware encrypted local data, and no recovery was possible.',
        whyItHappened: 'The malware bypassed initial defenses, and no offline backups were maintained.',
        whatCouldHaveHelped: 'Implement a secure, offline Backup strategy.',
        keyLesson: 'Without backups, a single destructive event can lead to permanent data loss.'
      }
    }
  }
];
