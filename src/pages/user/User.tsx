import { useContext } from 'react';
import Form from '../../components/form/Form';

import Layout from '../../components/layout/Layout';
import { UserContext } from '../../helpers/StateProvider';

const User = () => {

  const { user } = useContext(UserContext);

  return (
    <Layout>
      <div>
        <h2>Hei, {user.displayName}!</h2>
        <Form />
      </div>
    </Layout>
  )
}

export default User
