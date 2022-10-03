import {Container, Nav, NavDropdown, Form, FormControl, Button, Navbar} from 'react-bootstrap'

function NavBar() {

  function onSearch(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    const query = formDataObj.query;
    console.log(query);
    window.location.replace('/?s=' + query);
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/">Electronics Vendor</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="/">All Products</Nav.Link>
            <NavDropdown title="Account" id="navbarScrollingDropdown">
              <NavDropdown.Item href="/account">My Account</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/history">Purchase History</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#" disabled>
            </Nav.Link>
          </Nav>
          <Form className="d-flex" onSubmit={onSearch}>
            <FormControl
              type="text"
              placeholder="Search"
              className="me-2"
              name="query"
            />
            <Button type="submit" variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


export default NavBar;