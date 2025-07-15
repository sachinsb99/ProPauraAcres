<!DOCTYPE html>
<html>

<head>
    <title>Enquiry Confirmation - PROP AURA ACRES</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            min-height: 100vh;
            position: relative;
        }

        /* Background watermark */
        body::before {
            content: 'PROP AURA ACRES';
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 4rem;
            font-weight: 700;
            color: rgba(59, 130, 246, 0.08);
            z-index: 0;
            pointer-events: none;
            white-space: nowrap;
        }

        .container {
            max-width: 650px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
            z-index: 1;
        }

        .email-wrapper {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            overflow: hidden;
            border: 1px solid rgba(229, 231, 235, 0.8);
        }

        .header {
            background: linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="home-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M10 2L18 8v10H2V8z" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23home-pattern)"/></svg>');
            opacity: 0.3;
        }

        .header-content {
            position: relative;
            z-index: 2;
        }

        .logo {
            font-size: 2.2rem;
            font-weight: 700;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .tagline {
            font-size: 1rem;
            opacity: 0.9;
            font-weight: 300;
        }

        .home-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
        }

        .content {
            padding: 40px 30px;
            background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        }

        .welcome-message {
            text-align: center;
            margin-bottom: 30px;
            padding: 25px;
            background: linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 100%);
            border-radius: 12px;
            border-left: 4px solid #10b981;
        }

        .welcome-message h2 {
            color: #065f46;
            font-size: 1.5rem;
            margin-bottom: 10px;
        }

        .welcome-message p {
            color: #047857;
            font-size: 1rem;
        }

        .enquiry-details {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            margin: 25px 0;
            border: 1px solid #e5e7eb;
        }

        .enquiry-details h3 {
            color: #1f2937;
            font-size: 1.3rem;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .detail-item {
            display: flex;
            padding: 12px 0;
            border-bottom: 1px solid #f3f4f6;
            align-items: flex-start;
        }

        .detail-item:last-child {
            border-bottom: none;
        }

        .detail-label {
            font-weight: 600;
            color: #374151;
            min-width: 100px;
            margin-right: 15px;
        }

        .detail-value {
            color: #6b7280;
            flex: 1;
        }

        .next-steps {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            border-left: 4px solid #f59e0b;
        }

        .next-steps h3 {
            color: #92400e;
            font-size: 1.2rem;
            margin-bottom: 15px;
        }

        .next-steps ul {
            list-style: none;
            padding: 0;
        }

        .next-steps li {
            color: #a16207;
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }

        .next-steps li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
        }

        .contact-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            margin: 25px 0;
            text-align: center;
        }

        .contact-info h4 {
            color: #374151;
            margin-bottom: 15px;
            font-size: 1.1rem;
        }

        .contact-methods {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
        }

        .contact-method {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #6b7280;
            font-size: 0.9rem;
        }

        .footer {
            background: #1f2937;
            color: #9ca3af;
            text-align: center;
            padding: 25px;
            font-size: 0.85rem;
        }

        .footer p {
            margin-bottom: 10px;
        }

        .footer a {
            color: #3b82f6;
            text-decoration: none;
        }

        .icon {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }

        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
            margin: 30px 0;
        }

        @media (max-width: 600px) {
            .container {
                padding: 10px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .contact-methods {
                flex-direction: column;
                gap: 15px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="email-wrapper">
            <div class="header">
                <div class="header-content">
                    <div class="home-icon">
                        <svg class="icon" viewBox="0 0 24 24" fill="white">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                        </svg>
                    </div>
                    <div class="logo">PROP AURA ACRES</div>
                    <div class="tagline">Your Dream Home Awaits</div>
                </div>
            </div>

            <div class="content">
                <div class="welcome-message">
                    <h2>🏡 Thank You for Your Interest!</h2>
                    <p>We're thrilled that you're considering PROP AURA ACRES for your next home</p>
                </div>

                <p style="font-size: 1.1rem; margin-bottom: 20px;">Dear <strong>{{ $enquiry->name }}</strong>,</p>

                <p style="margin-bottom: 25px;">We have received your home enquiry and our dedicated property consultants will get back to you within <strong>24 hours</strong> with personalized recommendations tailored to your needs.</p>

                <div class="enquiry-details">
                    <h3>
                        <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                            <polyline points="14,2 14,8 20,8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10,9 9,9 8,9"/>
                        </svg>
                        Your Enquiry Details
                    </h3>
                    
                    <div class="detail-item">
                        <div class="detail-label">Name:</div>
                        <div class="detail-value">{{ $enquiry->name }}</div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-label">Email:</div>
                        <div class="detail-value">{{ $enquiry->email }}</div>
                    </div>
                    
                    @if ($enquiry->phone)
                    <div class="detail-item">
                        <div class="detail-label">Phone:</div>
                        <div class="detail-value">{{ $enquiry->phone }}</div>
                    </div>
                    @endif
                    
                    <div class="detail-item">
                        <div class="detail-label">Message:</div>
                        <div class="detail-value">{{ $enquiry->message }}</div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-label">Submitted:</div>
                        <div class="detail-value">{{ $enquiry->formatted_created_at }}</div>
                    </div>
                </div>

                <div class="next-steps">
                    <h3>What Happens Next?</h3>
                    <ul>
                        <li>Our property consultant will review your requirements</li>
                        <li>We'll prepare a curated list of homes matching your criteria</li>
                        <li>You'll receive personalized recommendations within 24 hours</li>
                        <li>We'll schedule a convenient time for property viewings</li>
                    </ul>
                </div>

                <div class="divider"></div>

                <div class="contact-info">
                    <h4>Need Immediate Assistance?</h4>
                    <div class="contact-methods">
                        <div class="contact-method">
                            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            +91 XXX XXX XXXX
                        </div>
                        <div class="contact-method">
                            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            info@propauraaacres.com
                        </div>
                    </div>
                </div>

                <p style="text-align: center; color: #10b981; font-weight: 600; font-size: 1.1rem; margin-top: 30px;">
                    🏠 We're excited to help you find your perfect home!
                </p>
            </div>

            <div class="footer">
                <p><strong>PROP AURA ACRES</strong> - Premium Properties, Exceptional Service</p>
                <p>This is an automated message. Please do not reply directly to this email.</p>
                <p>For inquiries, please contact us at <a href="mailto:info@propauraaacres.com">info@propauraaacres.com</a></p>
            </div>
        </div>
    </div>
</body>

</html>