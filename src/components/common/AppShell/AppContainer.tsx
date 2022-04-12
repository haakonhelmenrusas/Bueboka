import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Target } from 'tabler-icons-react';

import {
	AppShell,
	Navbar,
	Header,
	MediaQuery,
	Burger,
	useMantineTheme,
	ColorScheme,
	Button,
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
							background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
						},
					}}
					navbarOffsetBreakpoint="sm"
					fixed
					navbar={
						<Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 136, lg: 300 }}>
							<Anchor component={Link} to="/form">
								Sikteskjema <Target />
							</Anchor>
							<Anchor component={Link} to="#">
								<Button variant="outline" onClick={logOut}>Logg ut</Button>
							</Anchor>
						</Navbar>
					}
					header={
						<Header height={70} p="md">
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
								<MediaQuery largerThan="sm" styles={{ display: 'none' }}>
									<Burger
											opened={opened}
											onClick={() => setOpened((o) => !o)}
											size="sm"
											color={theme.colors.gray[6]}
											mr="xl"
									/>
								</MediaQuery>
								<div className={styles.brand}>
									<Link title="Profil" to="/user">
										<img className={styles.logo} src={Logo} alt="Logo"/>
										<h1 className={styles.title}>Book of Arrows</h1>
									</Link>
								</div>
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
