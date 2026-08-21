import Container from "./Container";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <p>
          Designed and built by Bighna Raj. © {year}
        </p>
      </Container>
    </footer>
  );
}

export default Footer;
