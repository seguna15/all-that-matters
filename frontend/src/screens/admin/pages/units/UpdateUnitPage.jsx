
import Header from "../../components/common/Header";
import { useUnitsStore } from "../../../../store/unitsStore";
import { useEffect } from "react";
import UnitForm from "./UnitForm";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../../../shared/hooks/useFetch";

const UpdateUnitPage = () => {
  const {id} = useParams()
  const navigate = useNavigate()
 
	const { isLoading, updateUnit, isUpdated, resetStore } = useUnitsStore();
  
 
  const { data, setData, isFetchLoading } = useFetch('units', id, "unit")

	const handleCreate = async () => {
		await updateUnit(data.name, id);
		setData(null);
	}

  useEffect(() => {
    if(isUpdated) {
      resetStore();
      navigate('/admin/units')
    }
  },[isUpdated])
  
	return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title="Categories" />

      <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
        {!isFetchLoading && (
          <UnitForm
            formLabel="Update Unit"
            handleSubmit={handleCreate}
            isLoading={isLoading}
            newUnit={data}
            setNewUnit={setData}
            submitLabel="Update Unit"
          />
        )}
      </main>
    </div>
  );
};
export default UpdateUnitPage;
