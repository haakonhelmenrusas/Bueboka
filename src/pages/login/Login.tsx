import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useMediaQuery} from "@mantine/hooks";
import {Bow, BrandGoogle, SquareRoot2, UserCircle} from "tabler-icons-react";
import {Button, Card, Text, ThemeIcon, Group, Grid} from "@mantine/core";

import { UserContext } from "../../helpers/StateProvider";
import { googleLogin } from "../../auth";
import Logo from '../../assets/images/logo512.png';
import Footer from "../../components/common/footer/Footer";
import styles from "./Login.module.css";

const Login = () => {
	const {user} = useContext(UserContext);
	const matches = useMediaQuery('(min-width: 900px)');
	const navigate = useNavigate();

	useEffect(() => {
		if (user.displayName) {
			navigate("/user");
		}
	}, [navigate, user]);

	return (
			<>
				<div className={styles.welcomeContainer}>
					<img className={styles.logo} alt="Logo" src={Logo} />
					<h1 className={styles.title}>Book of Arrows</h1>
					<Grid>
						{matches && <Grid.Col span={2} />}
						<Grid.Col span={matches ? 4 : 6}>
							<Card shadow="md" radius={6} withBorder>
								<Card.Section>
									<Group p="xs">
										<ThemeIcon>
											<UserCircle />
										</ThemeIcon>
										<Text>
											Egen profil
										</Text>
									</Group>
								</Card.Section>
							</Card>
						</Grid.Col>
						<Grid.Col span={matches ? 4 : 6}>
							<Card shadow="md" radius={6} withBorder>
								<Card.Section>
									<Group p="xs">
										<ThemeIcon>
											<Bow />
										</ThemeIcon>
										<Text>
											Bue & utstyr
										</Text>
									</Group>
								</Card.Section>
							</Card>
						</Grid.Col>
						{matches && <Grid.Col span={2} />}
						<Grid.Col span={12}>
							<Card shadow="md" radius={6} withBorder>
								<Card.Section>
									<Group p="xs">
										<ThemeIcon>
											<SquareRoot2 />
										</ThemeIcon>
										<Text>
											Beregning av siktemerker
										</Text>
									</Group>
								</Card.Section>
							</Card>
						</Grid.Col>
					</Grid>
					<Button mt={80} leftIcon={<BrandGoogle />} onClick={googleLogin}>
						Logg inn med Google
					</Button>
				</div>
				<Footer />
			</>
	);
};

export default Login;
