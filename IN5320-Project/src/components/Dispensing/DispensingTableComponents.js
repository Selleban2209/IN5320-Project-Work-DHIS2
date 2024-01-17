import classes from "../../App.module.css";
import {
DataTable,
DataTableCell,
DataTableBody,
DataTableHead,
DataTableRow,
colors,
IconCross24,
Button
} from '@dhis2/ui'

export function DispensingTable (props){
    let toBeDispensedMenu = props.list.map((item, index)=>{
        let commodityName = ""
        props.mergedData.forEach(data => {
            if(item.CommodityDispensed== data.id){
             commodityName =data.name.split("Commodities - ")[1]    ;
            }
        })
        return (
            <DataTableRow key={index}>
            <DataTableCell>
                {commodityName}
            </DataTableCell>
            <DataTableCell>
                {item.dispensedBy}
            </DataTableCell>

            <DataTableCell>
                {item.DispensedTo}
            </DataTableCell>
            <DataTableCell>
                 {item.Amount}        
            </DataTableCell>
            <DataTableCell>
                <Button
                small                   
                color ={colors.red700}
                icon={<IconCross24 color ={colors.red700} />}
                onClick={(()=>
                    props.setToBeDispensedList(props.list.filter((e,i) => i!== index))
                    )}
                >   
                </Button>
            </DataTableCell>
        </DataTableRow>
                    )
    })
           
    return (
        <DataTable>
                <DataTableHead>
                    <DataTableRow >
                        <DataTableCell staticStyle="True" >Commodity</DataTableCell>
                        <DataTableCell staticStyle="True" >Dispensed By</DataTableCell>
                        <DataTableCell staticStyle="True" >Dispensed To</DataTableCell>
                        <DataTableCell staticStyle="True" >Amount</DataTableCell>
                        <DataTableCell staticStyle="True" ></DataTableCell>
                    </DataTableRow>
                </DataTableHead> 
                <DataTableBody>
                    {toBeDispensedMenu}
                </DataTableBody>
    
        </DataTable>
            );
}


export function HistoryTable (props){
    let tableData = props.data.slice(0, props.data.length-1)
    if( props.data.length >3){
        tableData = props.data.slice(0,3)
    }
    //Slice array to show only the last 3 dispensing
    //Rest of dispensing history presists in history tab
    let RowData =    tableData.map ((item, index)=>{
        
        return(
            
            <DataTableRow key = {index} >
                <DataTableCell>Dispensing</DataTableCell>
                <DataTableCell>{item.DispensedBy}</DataTableCell>
                <DataTableCell>{item.TimeDispensed}</DataTableCell>
                <DataTableCell>{item.Commodities.length}</DataTableCell>
            </DataTableRow>
            ) 

        })    
    
    return (
       
        <DataTable>
                <DataTableHead>
                    <DataTableRow>
                        <DataTableCell staticStyle="True" >Transaction type</DataTableCell>
                        <DataTableCell staticStyle="True" >Dispensed By</DataTableCell>
                        <DataTableCell staticStyle="True" >Time of Dispensing</DataTableCell>
                        <DataTableCell staticStyle="True" >Items dispensed</DataTableCell>

                    </DataTableRow>
                </DataTableHead> 
                <DataTableBody>
                {tableData && RowData}
                </DataTableBody>
                <DataTableBody>
                
                </DataTableBody>
        </DataTable>
    );    
}