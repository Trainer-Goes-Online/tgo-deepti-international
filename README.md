# tgo-deepti-international

Deepti's VSL funnel for clients outside India. A fork of `tgo-deepti`, with
the payment taken out: the assessment is free.

    landing  ->  /register  ->  /book-a-call  ->  /thank-you
                 (free form)     (Cal embed)      (prep page)

No Razorpay, no order, no receipt, no fee to refund. The registration form is
the conversion, and it posts to `/api/register`, which hands the record to
Pabbly and sends Meta's `Lead` and GA4's `generate_lead` from the server.

`SESSION_STATE.md` is the working record: read the fork section at the top of
it before changing anything.
# tgo-deepti-international
