import React, { useEffect, useState, ChangeEvent } from "react";
import { Button, TextInput, Select, Modal } from "@mantine/core";
import { Bow, Hash } from "tabler-icons-react";
import { useArcherNumber, useBowType } from "../../../helpers/hooks";
import { Status } from "../../../models";
import styles from "./ProfileForm.module.css";

interface IProfileForm {
  bowType: string | null;
  archerNumber: string | null;
  showEditForm: boolean;
  setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileForm: React.FC<IProfileForm> = ({
  bowType,
  archerNumber,
  showEditForm,
  setShowEditForm,
}) => {
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (archerNum) {
      writeArcherNumber(parseInt(archerNum));
    }
    if (bow) {
      writeBowType(bow);
    }
    setShowEditForm((state) => !state);
  };

  const handleArcherNumber = (event: ChangeEvent<HTMLInputElement>) => {
    setArcherNum(event.currentTarget.value);
  };
  const handleBowType = (bowType: string) => {
    setBowType(bowType);
  };

  return (
    <Modal
      title="Rediger profil"
      opened={showEditForm}
      centered
      onClose={() => setShowEditForm(false)}
    >
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
            icon={<Bow size={14} />}
            onChange={handleBowType}
            placeholder="Velg din buetype"
            aria-label="Velg din buetype"
            data={[
              "Compound",
              "Recurve",
              "Barebow",
              "Tradisjonell",
              "Langbue",
              "Annet",
            ]}
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
