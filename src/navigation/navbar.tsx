import * as React from 'react'
import styled from 'styled-components'

const NavigationBar = (props: {
    brand: { name: string; to: string },
    links: Array<{ name: string, to: string }>,
}) => {
    const {brand, links} = props;
    const NavLinks: any = () => links.map((link: { name: string, to: string }) => <a href={link.to}>{link.name}</a>);
    return (
        <Navbar>
            <Brand href={brand.to}>{brand.name}</Brand>
            <NavLinks/>
        </Navbar>
    )
};

const Theme = {
    colors: {
        bg: `#fff`,
        dark: `#24292e`,
        light: `#EEEEEE`,
        yellow: `#f8ac00`,
    },
    fonts: {
        body: `IBM Plex Sans, sans-serif`,
        heading: `Copperplate Gothic Bold`,
    }
}

const Navbar = styled.nav`
  background: ${Theme.colors.yellow};
  font-family: ${Theme.fonts.body};
  color: ${Theme.colors.light};
  display: flex;
  align-items: center;
  height: 4rem;


  a {
    color: #3e3e3e;
    text-decoration: none;
    margin-right: 3rem;
    -webkit-transition: font-size .5s ease;
    -moz-transition: font-size .5s ease;
    -o-transition: font-size .5s ease;
    transition: font-size .5s ease;
  }

a:hover{
  font-size: 24px;
}
`;

const Brand = styled.a`
  font-weight: bold;
  margin-left: 1rem;
  font-family: ${Theme.fonts.heading};
  font-size: 24px;
  padding-right: 3rem;`;



export default NavigationBar;
