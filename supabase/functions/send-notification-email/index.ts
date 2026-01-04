import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationEmailRequest {
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  message?: string;
  notificationEmail: string;
  ccEmail?: string;
  instantAlert?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      name,
      email,
      phone,
      projectType,
      budget,
      message,
      notificationEmail,
      ccEmail,
      instantAlert
    }: NotificationEmailRequest = await req.json();

    console.log("Sending notification email to:", notificationEmail);
    console.log("Instant alert:", instantAlert);

    const subject = instantAlert 
      ? `🔔 New Submission Alert: ${name}` 
      : `New Contact Form Submission from ${name}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B4513; border-bottom: 2px solid #8B4513; padding-bottom: 10px;">
          ${instantAlert ? '🔔 Instant Alert: ' : ''}New Contact Form Submission
        </h2>
        
        <div style="background-color: #f9f7f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Contact Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
        </div>
        
        ${projectType || budget ? `
        <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Project Information</h3>
          ${projectType ? `<p><strong>Project Type:</strong> ${projectType}</p>` : ''}
          ${budget ? `<p><strong>Budget Range:</strong> ${budget}</p>` : ''}
        </div>
        ` : ''}
        
        ${message ? `
        <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Message</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        ` : ''}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          <p>This email was sent from your KD Mistry Interiors dashboard.</p>
          <p>Submitted at: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    const toEmails = [notificationEmail];
    if (ccEmail && ccEmail.trim()) {
      toEmails.push(ccEmail);
    }

    const emailResponse = await resend.emails.send({
      from: "KD Mistry Interiors <onboarding@resend.dev>",
      to: toEmails,
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
