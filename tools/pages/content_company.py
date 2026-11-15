from ui import *

def opt(title, sub, on=False):
    dot = '<span style="width:16px;height:16px;border-radius:50%;flex:none;box-shadow:inset 0 0 0 1.5px #0a0a0a;display:grid;place-items:center">' + ('<span style="width:8px;height:8px;border-radius:50%;background:#0a0a0a"></span>' if on else '') + '</span>'
    bg = 'background:#fafaf9;box-shadow:0 0 0 1px #0a0a0a' if on else 'box-shadow:0 0 0 1px var(--l1)'
    return f'<div style="display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border-radius:12px;{bg}">{dot}<div><b style="font-weight:500;display:block">{title}</b><span style="font-size:12px;color:var(--t4)">{sub}</span></div></div>'

def section(title, sub, inner):
    return f'<div style="padding:18px 22px;border-bottom:1px solid var(--l2)"><div style="font-weight:500">{title}</div><div style="font-size:12px;color:var(--t4);margin:2px 0 12px">{sub}</div>{inner}</div>'

SHARING = section('Inbox sharing', 'What your team can see from jonah@lumenskin.com', '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">' + opt('Share everything', 'Subject, preview and Otto\'s facts') + opt('Who and when only', 'That a conversation happened', True) + opt('Only me', 'Nothing is shared') + '</div>')
ACCOUNTS = section('Connected accounts', 'Disconnect any time, and what we stored is deleted', ''.join(f'<div style="display:flex;align-items:center;gap:12px;padding:8px 0">{lg(n,24)}<b style="font-weight:500;flex:1">{n}</b><span style="font-size:12px;color:var(--t4)">{w}</span><span class="pb sm" style="background:#fff;color:var(--t1);box-shadow:0 0 0 1px var(--l1)">Disconnect</span></div>' for n, w in [('Gmail', 'Read only, 2,184 emails'), ('Google Calendar', 'Read only, 18 meetings')]))
DNT = section('Do not track', 'These people and domains never sync', '<div style="display:flex;flex-wrap:wrap;gap:6px">' + ''.join(badge(t) for t in ['family@gmail.com', 'lawfirm.com', 'hr@lumenskin.com']) + '</div>')

PAGES = [
dict(slug='security',
  title='Security: how Omniscient handles your data',
  desc='How Omniscient handles your email, calendar and customer data: it sends only what you approve, encrypts your data, never trains AI on it, and deletes it when you leave.',
  h1='Your customer data, handled with care',
  lede='Omniscient reads your email and calendar so your records stay current. Here is exactly what it does with them, and what it never does.',
  note='Questions about security? Write to hello@tryomniscient.com.',
  hero=vis(shell('', head('Settings', 'Privacy and security', crumb='Settings', acts=False) + f'<div class="dbody">{SHARING}{ACCOUNTS}{DNT}</div>', h=660), w=1360,
    a=acc('tr', 'Sharing updated', 'Who and when only, for your inbox')),
  rows=[
    dict(k='Sending', h='It reads. You decide what goes out.', p='Omniscient reads your email and calendar to keep records current. It sends an email only when you click Send, or when you publish a workflow whose emails you approved. It never deletes or edits anything in your inbox.',
      pts=['Drafts wait for you to send them', 'Workflow emails need your approval first', 'Your inbox is never changed'],
      v=vis(win(f'<div class="card-h">{ic("Mail","i14")}Email draft<span class="r">{byotto()}</span></div><div class="card-b" style="padding:16px 18px;font-size:14px;line-height:1.6"><div style="color:var(--t3)">To claire@maisonverre.co</div><div style="font-weight:600;margin:2px 0 10px">Re: Pricing for 40 doors?</div><div>Hi Claire, 40 doors works at $14 a unit. I can send the order form today.</div></div><div class="card-f" style="padding:10px 18px">{pb("Open in Gmail","Mail")}<span style="font-size:12px;color:var(--t4)">Sent only when you send it</span></div>', 600))),
    dict(k='Privacy', h='Every inbox gets its own rule', p='Each person chooses what the team sees from their inbox: everything, only that a conversation happened, or nothing at all. The rule is enforced in the database, so it holds for everyone on the team. A do-not-track list keeps people and domains out entirely.',
      v=vis(win(section('Inbox sharing', 'What a teammate sees from your inbox', '<div style="display:flex;flex-direction:column;gap:8px">' + opt('Share everything', 'Subject, preview and Otto\'s facts') + opt('Who and when only', 'That a conversation happened', True) + opt('Only me', 'Nothing is shared') + '</div>'), 560))),
    dict(k='Control', h='Otto asks before anything changes', p='When Otto suggests an update, it shows the quote it came from and waits for you. Every change is saved in the history, you can undo it, and anything a person creates can be deleted.',
      pts=['A card before every change', 'Full history on every field', 'Undo and delete anything'],
      v=vis(win(head('Calendar', 'Wholesale scoping call', acts=False, extra=badge('Past')) + f'<div style="padding:14px 16px 4px;font-weight:500">Record updates to review <span style="color:var(--t4);font-weight:400">2</span></div>' + urow('Set <b>Stage</b> to <b>Proposal</b>', "Send us the proposal and we'll take it from there.") + urow('Set <b>Amount</b> to <b>$86,400</b>', 'Around $80 to $90k for the first order.'), 620))),
  ],
  band=dict(k='Security', h='<span>Your data stays yours.</span> Encrypted, and never used to train AI.', pts=[
    ('Check', 'Encrypted at rest', 'Your data is encrypted at rest, and sign-in tokens get a second layer of AES-256 encryption.'),
    ('Ban', 'Never used for training', 'Your emails and calls are never used to train AI models. Google\'s Limited Use rules apply.'),
    ('Trash', 'Deleted when you leave', 'Disconnect any time and the emails and meetings we stored are deleted. Any list exports to CSV.')]),
  faq=[('Does Omniscient send emails on its own?', 'No. It sends an email only when you click Send, or when you publish a workflow whose emails you approved. It never deletes or edits anything in your inbox.'),
       ('Is my data used to train AI models?', 'No. Your emails and calls are never used to train AI models, and Google\'s Limited Use rules apply to data from Google accounts.'),
       ('Who on my team can see my emails?', 'You decide for your own inbox: share everything, share only that a conversation happened, or keep it private. The rule is enforced in the database.'),
       ('What happens to my data if I leave?', 'Disconnect your accounts and the emails and meetings we stored are deleted. You can export any list to CSV first, and delete anything you created at any time.')],
  fin=['Your data,', 'handled with', 'care.'], fin_p='Questions about security? Write to hello@tryomniscient.com.',
  rel=['product/omniscience', 'product/email-sync', 'developers']),
]
