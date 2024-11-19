import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "../../../components/ProductCard";
import { apiClient } from "../../../api";
import { Spinner } from "../../../components";

const PeopleAlsoBought = () => {
	const [recommendations, setRecommendations] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRecommendations = async () => {
			try {
				const res = await apiClient.get("/products/recommended/get");
				setRecommendations(res.data.products);
			} catch (error) {
				toast.error(error.response.data.message || "An error occurred while fetching recommendations");
			} finally {
				setIsLoading(false);
			}
		};

		fetchRecommendations();
	}, []);

	if (isLoading) return <Spinner />;

	return (
		<div className='mt-8'>
			<h3 className='text-2xl font-semibold text-emerald-400'>People also bought</h3>
			<div className='grid grid-cols-1 gap-4 mt-6 sm:grid-cols-3 lg:grid-col-3'>
				{recommendations.map((product) => (
					<ProductCard key={product?._id} product={product} />
				))}
			</div>
		</div>
	);
};
export default PeopleAlsoBought;