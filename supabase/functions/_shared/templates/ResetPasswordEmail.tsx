
import { Body, Button, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface ResetPasswordEmailProps {
  resetLink: string;
  userName?: string;
}

const baseUrl = "https://app.plenus.com.br"; // Domínio principal da sua aplicação

export const ResetPasswordEmail = ({
  resetLink,
  userName = 'Usuário',
}: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Redefina sua senha do Plenus</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={`${baseUrl}/logo.png`} width="96" height="96" alt="Plenus" style={logo} />
        <Heading style={heading}>Redefinição de Senha</Heading>
        <Text style={paragraph}>
          Olá {userName},
        </Text>
        <Text style={paragraph}>
          Recebemos uma solicitação para redefinir a senha da sua conta Plenus. Se foi você, clique no botão abaixo para criar uma nova senha.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={resetLink}>
            Redefinir Senha
          </Button>
        </Section>
        <Text style={paragraph}>
          Se você não solicitou a redefinição de senha, pode ignorar este e-mail com segurança.
        </Text>
        <Text style={paragraph}>
          Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
        </Text>
        <Text style={linkStyle}>{resetLink}</Text>
        <Hr style={hr} />
        <Text style={footer}>
          Equipe Plenus
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ResetPasswordEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
};

const logo = {
  margin: '0 auto',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '48px',
  textAlign: 'center' as const,
  color: '#1a202c',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 20px',
  color: '#4a5568',
};

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '24px',
  marginBottom: '24px',
};

const button = {
  backgroundColor: '#48bb78',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '20px 0',
};

const footer = {
  color: '#a0aec0',
  fontSize: '12px',
  textAlign: 'center' as const,
};

const linkStyle = {
  ...paragraph,
  color: '#2b6cb0',
  wordBreak: 'break-all' as const,
};
