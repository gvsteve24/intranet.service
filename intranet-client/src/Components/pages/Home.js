import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Logo } from '../../styles/Lib';
import Login from "../Login";

export default function Home() {
	const history = useHistory();

	useEffect(() => {
		let user = JSON.parse(localStorage.getItem("user"));
		if (user && user.token) {
			history.push("/users");
		}
	}, []);

	return (
		<div className="App">
			<Link to="/">
				<Logo />
			</Link>
			<Login />
		</div>
	);
}
