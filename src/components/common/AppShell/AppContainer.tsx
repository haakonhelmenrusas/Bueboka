import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Target, Logout, InfoCircle } from 'tabler-icons-react';

import {
	AppShell,
	Navbar,
	Header,
	MediaQuery,
	Burger,
	useMantineTheme,
	ColorScheme,
	Anchor
} from '@mantine/core';

import Logo from "../../../assets/images/logo512.png";
import { ThemeToggle } from "../index";
import { logOut } from "../../../auth";
import styles from "./AppContainer.module.css";

interface IAppContainer {
	colorScheme: ColorScheme;
	toggleColorScheme: () => void;
	children: React.ReactNode;
}

const AppContainer: React.FC<IAppContainer> = ({ colorScheme, toggleColorScheme, children }) => {
	const theme = useMantineTheme();
	const [opened, setOpened] = useState(false);
	return (
			<AppShell
					styles={{
						main: {
							display: "flex",
							flexDirection: "column",
							background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
						},
					}}
					navbarOffsetBreakpoint="sm"
					fixed
					navbar={
						<Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 148, lg: 200 }}>
							<Navbar.Section grow>
								<Anchor component={Link} to="/form">
									<Target /> Sikteskjema
								</Anchor>
							</Navbar.Section>
							<Navbar.Section style={{ display: 'flex', flexDirection: 'column'}}>
								<Anchor component={Link} to="/about" style={{ marginBottom: 16 }}>
									<InfoCircle /> Om oss
								</Anchor>
								<Anchor onClick={logOut} component={Link} to="#"><Logout />   Logg ut</Anchor>
							</Navbar.Section>
						</Navbar>
					}
					header={
						<Header className={styles.header} height={70} p="md">
							<MediaQuery largerThan="sm" styles={{ display: 'none' }}>
								<Burger
										opened={opened}
										onClick={() => setOpened((o) => !o)}
										size="sm"
										color={theme.colors.gray[6]}
										mr="xl"
								/>
							</MediaQuery>
							<Anchor className={styles.brand} component={Link} to="/user">
								<img className={styles.logo} src={Logo} alt="Logo"/>
								<h1 className={styles.title}>Book of Arrows</h1>
							</Anchor>
							<div className={styles.themeButton}>
								<ThemeToggle colorScheme={colorScheme} toggleColorScheme={toggleColorScheme} />
							</div>
						</Header>
					}
			>
				{children}
			</AppShell>
	);
}

export default AppContainer;
