import { Link } from 'react-router';
import React from 'react'

const NavLink = (props) => {
	/* React is taking advantage of the ES7 proposed support for the spread operator `...` for Objects (not just iterables as in ES6).
	Notice that with React we use camelCase rather than kebab-case (activeStyle vs active-style)
	One way a `Link` tag is different from an `a` tag is that it knows if the path it links to is active so you can style it differently.
	*/
	return (
		<Link {...props} activeStyle={{ color: 'pink' }}></Link>
	)
}	

export default NavLink;