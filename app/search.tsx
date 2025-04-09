import SearchPage from "../components/searchPage";

export default function page(){
    return <SearchPage setLatitude={function (lat: number): void {
        throw new Error("Function not implemented.");
    } } setLongitude={function (lon: number): void {
        throw new Error("Function not implemented.");
    } }></SearchPage>;
}