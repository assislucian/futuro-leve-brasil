
import { Body, Button, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface ConfirmEmailProps {
  confirmationLink: string;
  userName?: string;
}

const baseUrl = "https://app.plenus.com.br"; // Domínio principal da sua aplicação

export const ConfirmEmail = ({
  confirmationLink,
  userName = 'pessoa',
}: ConfirmEmailProps) => (
  <Html>
    <Head />
    <Preview>Confirme seu e-mail e comece a transformar sua vida financeira com o Plenus</Preview>
    <Body style={main}>
      <Container style={container}>
        <div style={logoContainer}>
          <div style={logoBackground}>
            <Text style={logoText}>✨</Text>
          </div>
          <Heading style={logoHeading}>Plenus</Heading>
        </div>
        
        <Heading style={heading}>Bem-vindo(a) ao Plenus, {userName}! 🎉</Heading>
        
        <Text style={paragraph}>
          Que alegria ter você conosco! Você está a apenas um clique de começar sua jornada rumo à plenitude financeira.
        </Text>
        
        <Text style={paragraph}>
          O Plenus vai ajudar você a:
        </Text>
        
        <ul style={list}>
          <li style={listItem}>📊 Organizar suas finanças de forma simples</li>
          <li style={listItem}>🎯 Criar e acompanhar suas metas financeiras</li>
          <li style={listItem}>💰 Transformar seus sonhos em realidade</li>
          <li style={listItem}>🚀 Conquistar a tranquilidade financeira</li>
        </ul>

        <Text style={paragraph}>
          Para ativar sua conta e começar a usar todas as funcionalidades do Plenus, clique no botão abaixo:
        </Text>
        
        <Section style={btnContainer}>
          <Button style={button} href={confirmationLink}>
            ✅ Confirmar meu E-mail e Começar
          </Button>
        </Section>
        
        <Text style={paragraph}>
          Ou copie e cole este link no seu navegador:
        </Text>
        <Text style={linkStyle}>{confirmationLink}</Text>
        
        <Hr style={hr} />
        
        <Text style={footerBold}>
          🌟 Sua jornada financeira começa agora!
        </Text>
        
        <Text style={footer}>
          Atenciosamente,<br />
          <strong>Equipe Plenus</strong><br />
          <em>"Transformando sonhos em realidade financeira"</em>
        </Text>
        
        <Text style={footerSmall}>
          Se você não criou esta conta, pode ignorar este e-mail com segurança.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ConfirmEmail;

const main = {
  backgroundColor: '#f8fafc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  maxWidth: '580px',
};

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const logoBackground = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '64px',
  height: '64px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  marginBottom: '12px',
};

const logoText = {
  fontSize: '28px',
  margin: '0',
  color: '#ffffff',
};

const logoHeading = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginTop: '32px',
  marginBottom: '24px',
  textAlign: 'center' as const,
  color: '#1e293b',
  lineHeight: '1.3',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 32px',
  color: '#475569',
  marginBottom: '16px',
};

const list = {
  padding: '0 32px',
  margin: '16px 0',
};

const listItem = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#475569',
  marginBottom: '8px',
};

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
  marginBottom: '32px',
  padding: '0 32px',
};

const button = {
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
  boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 0',
};

const footerBold = {
  ...paragraph,
  fontWeight: 'bold',
  fontSize: '18px',
  color: '#10b981',
  textAlign: 'center' as const,
  marginBottom: '16px',
};

const footer = {
  color: '#64748b',
  fontSize: '14px',
  textAlign: 'center' as const,
  padding: '0 32px',
  lineHeight: '22px',
  marginBottom: '16px',
};

const footerSmall = {
  color: '#94a3b8',
  fontSize: '12px',
  textAlign: 'center' as const,
  padding: '0 32px',
  lineHeight: '18px',
};

const linkStyle = {
  ...paragraph,
  color: '#2563eb',
  wordBreak: 'break-all' as const,
  fontSize: '14px',
  textAlign: 'center' as const,
};
