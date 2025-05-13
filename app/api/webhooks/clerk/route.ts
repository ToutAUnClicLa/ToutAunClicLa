import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function handleUserCreated(data: any) {
  const { id, email_addresses, first_name, last_name } = data;
  const primaryEmail = email_addresses.find((email: any) => email.id === data.primary_email_address_id);

  await supabase.from('usuarios').insert({
    clerk_id: id,
    email: primaryEmail.email_address,
    first_name: first_name || '',
    last_name: last_name || '',
    autenticacion_social: data.oauth_accounts?.length > 0
  });
}

async function handleUserUpdated(data: any) {
  const { id, email_addresses, first_name, last_name } = data;
  const primaryEmail = email_addresses.find((email: any) => email.id === data.primary_email_address_id);

  await supabase.from('usuarios').update({
    email: primaryEmail.email_address,
    first_name: first_name || '',
    last_name: last_name || '',
    autenticacion_social: data.oauth_accounts?.length > 0
  }).eq('clerk_id', id);
}

async function handleUserDeleted(data: any) {
  const { id } = data;
  await supabase.from('usuarios').delete().eq('clerk_id', id);
}

export async function POST(req: Request) {
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature || !webhookSecret) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  const eventType = evt.type;

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;
      default:
        console.log('Unhandled event type:', eventType);
    }

    return new Response('Success', { status: 200 });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response('Error processing webhook', { status: 500 });
  }
}