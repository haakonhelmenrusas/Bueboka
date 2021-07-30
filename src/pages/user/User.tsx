import { useContext } from 'react';
import ArcherNumber from '../../components/archerNumber/ArcherNumber';
import Input from '../../components/input/Input';

import Layout from '../../components/layout/Layout';
import { UserContext } from '../../helpers/StateProvider';

const User = () => {

  const { user } = useContext(UserContext);

  return (
    <Layout>
      <div>
        <h2>Hei, {user.displayName}!</h2>
        <ArcherNumber archerNumber={2304} />
        <div>
          <p>Legg inn ditt skytternr her</p>
          <Input labelName="Skytternr" name="skytternr" id="skytternr" type="number" style={{ width: 64}} />
        </div>
      </div>
    </Layout>
  )
}

export default User;
