// Privacy policy copy for the Hall of Fame / league app.
// Reviewed for accuracy against the data this app actually processes as of
// the date below — update alongside any change to what's collected or which
// third parties process it.

export const PRIVACY_POLICY_LAST_UPDATED = '11 July 2026';

export const PRIVACY_POLICY_CONTACT_EMAIL = 'jason.gilbert672@gmail.com';

export const PRIVACY_POLICY_SECTIONS = [
  {
    heading: 'Who we are',
    body: `Triple Pick League is a friend-group prediction game run by its organiser (contact: ${PRIVACY_POLICY_CONTACT_EMAIL}), who acts as the data controller for the purposes of UK GDPR and the Data Protection Act 2018.`,
  },
  {
    heading: 'What we collect',
    body: `Player display name, your gameweek picks and captain selections, and the scores those picks generate. If the league later adds paid entry, payment details would be collected and processed by Stripe on our behalf — we would never see or store your card details. If WhatsApp is used to share league updates, any number you use to join that group is visible to its members and to WhatsApp/Meta, not to us.`,
  },
  {
    heading: 'Why we process it (lawful basis)',
    body: `Running the league and calculating standings is necessary to perform our arrangement with you as a participant (contract). Where we ever send optional marketing or reminder messages beyond league admin, we'll ask for your consent first. We don't use your data for anything beyond running the game.`,
  },
  {
    heading: 'Who else sees it',
    body: `Picks and scores are stored with JSONBin.io (data host) and the app is served via Vercel (hosting). Both process data on our behalf under their own standard data processing terms. We don't sell or share your data with anyone else.`,
  },
  {
    heading: 'How long we keep it',
    body: `Picks and standings are kept for the current tournament season and one further season for record-keeping, then deleted. You can ask us to delete your data sooner at any time.`,
  },
  {
    heading: 'Your rights',
    body: `You can ask us to access, correct, or delete your data, or to restrict how we use it, at any time by contacting ${PRIVACY_POLICY_CONTACT_EMAIL}. You also have the right to complain to the UK Information Commissioner's Office (ico.org.uk) if you think we've mishandled your data.`,
  },
  {
    heading: 'Cookies & local storage',
    body: `This site stores a small amount of information in your browser's local storage — your player identity link and your cookie-notice preference — so the app works without asking you to log in every visit. These are strictly necessary for the site to function and aren't used for tracking or advertising. We don't currently run analytics or advertising cookies; if that changes, we'll update this notice and ask for your consent first.`,
  },
];
