import { Link } from 'react-router';
import React from 'react'

const NavLink = (props) => {
	/* React is taking advantage of the ES7 proposed support for the spread operator `...` for Objects (not just iterables as in ES6).*/
	return (
		<Link {...props} activeStyle={{ color: 'pink' }}></Link>
	)
}	

export default NavLink;