
const Footer = () => {
  return (
    <footer className="py-8 border-t">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-muted-foreground">© 2025 Plenus. Todos os direitos reservados.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="text-sm text-muted-foreground hover:text-primary">Termos de Uso</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-primary">Política de Privacidade</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
