import React from "react";
import TitlePage from "../../components/title_pages/TitlePage";
import Header from "../../components/header/Header";
import { ICONS } from "../../config/ICONS";
import Button from "../../components/button/Button";
import SearchBar from "../../components/table/SearchBar";
import Table from "../../components/table/Table";

class Students extends React.Component {
    state ={
        loading : true,

    }
    
    render() {
        return (
            <>
                <Header />
                <div className="container">
                    <div className="flex items-center justify-between">
                        <TitlePage title="Students" icon={<ICONS.Students />} size="text-2xl"
                    color="text-gray-700" />
                        <Button title="Add Student" icon={<ICONS.plus />} />
                    </div>
                    <SearchBar />

                </div>
            </>
        )
    };
}
export default Students;