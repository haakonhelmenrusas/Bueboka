import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Modal, Select, TextInput } from "@mantine/core";
import { Bow, Hash } from "tabler-icons-react";
import { useArcherNumber, useBowType } from "../../../helpers/hooks";
import { Status } from "../../../types";
import styles from "./ProfileForm.module.css";
import { SelectItem } from "./Helpers";

interface ProfileFormProps {
  bowType: string | null;
  archerNumber: string | null;
  showEditForm: boolean;
  setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ bowType, archerNumber, showEditForm, setShowEditForm }) => {
  const { writeBowType } = useBowType();
  const { status, writeArcherNumber } = useArcherNumber();

  const [archerNum, setArcherNum] = useState<string>("");
  const [bow, setBowType] = useState<string>("");

  useEffect(() => {
    if (archerNumber) {
      setArcherNum(archerNumber);
    }
    if (bowType) {
      setBowType(bowType);
    }
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (archerNum) {
      await writeArcherNumber(parseInt(archerNum));
    }
    if (bow) {
      await writeBowType(bow);
    }
    setShowEditForm((state) => !state);
  }

  function handleArcherNumber(event: ChangeEvent<HTMLInputElement>) {
    setArcherNum(event.currentTarget.value);
  }

  function handleBowType(bowType: string) {
    setBowType(bowType);
  }

  return (
    <Modal title="Rediger profil" opened={showEditForm} centered onClose={() => setShowEditForm(false)}>
      <form onSubmit={handleSubmit}>
        <div className={styles.numberForm}>
          <TextInput
            icon={<Hash size={14} />}
            style={{ marginBottom: 8 }}
            value={archerNum}
            maxLength={6}
            onChange={handleArcherNumber}
            type="tel"
            placeholder="F.eks. 2342"
            label="Skytternr."
          />
          <Select
            value={bow}
            label="Bue"
            icon={<Bow size={14} />}
            onChange={handleBowType}
            itemComponent={SelectItem}
            placeholder="Velg din buetype"
            aria-label="Velg din buetype"
            data={["Compound", "Recurve", "Barebow", "Tradisjonell", "Langbue", "Annet"]}
          />
        </div>
        <Button fullWidth loading={status === Status.Pending} type="submit">
          Lagre
        </Button>
      </form>
    </Modal>
  );
};

export default ProfileForm;
