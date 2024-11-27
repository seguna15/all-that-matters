import Header from "../../components/common/Header";
import { useUnitsStore } from "../../../../store/unitsStore";
import { useEffect, useState } from "react";
import UnitForm from "./UnitForm";
import { useNavigate } from "react-router-dom";

const AddUnitPage = () => {
	const { isLoading, createUnit, isAdded, resetStore } = useUnitsStore();
  const navigate = useNavigate()
	const [newUnit, setNewUnit] = useState({
        name: "",
  })
	const handleCreate = async () => {
		await createUnit(newUnit);
		setNewUnit({
			name: "",
			
		});
	}

  useEffect(() => {
    if(isAdded) {
      resetStore()
      navigate("/admin/units")
    }
  },[isAdded])

	return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title="Categories" />

      <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
        <UnitForm
          formLabel="Create New Unit"
          handleSubmit={handleCreate}
          isLoading={isLoading}
          newUnit={newUnit}
          setNewUnit={setNewUnit}
          submitLabel="Create Unit"
        />
      </main>
    </div>
  );
};
export default AddUnitPage;
