
import { Body, Button, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface ConfirmEmailProps {
  confirmationLink: string;
  userName?: string;
}

const baseUrl = "https://app.plenus.com.br"; // Domínio principal da sua aplicação

export const ConfirmEmail = ({
  confirmationLink,
  userName = 'Usuário',
}: ConfirmEmailProps) => (
  <Html>
    <Head />
    <Preview>Confirme seu e-mail para começar a usar o Plenus</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={`${baseUrl}/logo.png`} width="96" height="96" alt="Plenus" style={logo} />
        <Heading style={heading}>Bem-vindo(a) ao Plenus!</Heading>
        <Text style={paragraph}>
          Olá {userName},
        </Text>
        <Text style={paragraph}>
          Estamos muito felizes em ter você conosco. Para começar a transformar sua vida financeira, por favor, confirme seu endereço de e-mail clicando no botão abaixo.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={confirmationLink}>
            Confirmar meu E-mail
          </Button>
        </Section>
        <Text style={paragraph}>
          Se o botão não funcionar, você pode copiar e colar o seguinte link no seu navegador:
        </Text>
        <Text style={linkStyle}>{confirmationLink}</Text>
        <Hr style={hr} />
        <Text style={footer}>
          Equipe Plenus
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ConfirmEmail;

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
