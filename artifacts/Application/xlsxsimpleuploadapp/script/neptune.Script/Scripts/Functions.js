function appSetBusy(val) {
    oApp.setBusy(val);
}

function buildDataTable(excelTab) {
    excelHeader = Object.keys(excelTab[0]);

    excelHeader.forEach(function (header) {
        //Adding Column data and Bindings to TableXLSXData
        var colTableData = new sap.m.Column("colTableData" + header, {});
        var lblTableData = new sap.m.Text("lblTableData" + header, {
            text: header,
        });

        TableXLSXData.addColumn(colTableData);
        colTableData.setHeader(lblTableData);

        var txtTableData = new sap.m.Text("txtTableData" + header, {
            text: "{" + header + "}",
        });
        colItemTableXLSX.addCell(txtTableData);
    });

    TableXLSXData.setVisible(true);
    modelTableXLSXData.setData(excelTab);
    modelTableXLSXData.refresh();
    TableXLSXData.setHeaderText("XLSX Data Rows: " + excelTab.length);

    ButtonSave.setEnabled(true);
}

function saveXLSXData(headerData, xlsxTableData) {
    //In here we're going to save the XLSX data to the backend via a Table API
    appSetBusy(true);

    var xlsx_columnsData = [],
        xlsx_columnsDataStruc = {},
        xlsxStruc = {},
        apiData = [];

    console.log(headerData);
    console.log(xlsxTableData);

    headerData.forEach(function (header) {
        //Building the Header data to later save it on a JSON type Field
        xlsx_columnsDataStruc = {
            keyfield: header,
        };

        xlsx_columnsData.push(xlsx_columnsDataStruc);
    });

    xlsxTableData.forEach(function (content, a) {
        //Building the data structure dynamically to be saved by the API
        var values = Object.values(content); //Get each value of the table data
        var keys = Object.keys(content); //Get each keyfield of the table data

        var fieldnr = 0; //Dynamic Field Number

        keys.forEach(function (content_keys, b) {
            fieldnr++;

            var fieldkey = "xlsx_datacolumn" + fieldnr;
            var fieldvalue = values[b];

            var fieldstruc = { [fieldkey]: fieldvalue };

            Object.assign(xlsxStruc, fieldstruc);
        });

        apiData.push({
            file_columns: xlsx_columnsData,
            file_datacolumn1: xlsxStruc.xlsx_datacolumn1,
            file_datacolumn2: xlsxStruc.xlsx_datacolumn2,
            file_datacolumn3: xlsxStruc.xlsx_datacolumn3,
            // xlsx_datacolumn4: xlsxStruc.xlsx_datacolumn4,
            // xlsx_datacolumn5: xlsxStruc.xlsx_datacolumn5,
            // xlsx_datacolumn6: xlsxStruc.xlsx_datacolumn6,
            // xlsx_datacolumn7: xlsxStruc.xlsx_datacolumn7,
            // xlsx_datacolumn8: xlsxStruc.xlsx_datacolumn8,
            file_type: selectedFile.name.split(".")[1],
        });
    });

    console.log(apiData);

    // In here we're going to send the data to be saved in the table in Open Edition
    var options = {
        parameters: {
            where: "", // Optional
        },
        data: apiData,
    };

    apiRestAPISaveFileData(options);
}

function ClearEverything() {
    uploadXLS.setValue("");

    TableXLSXData.removeAllColumns();
    TableXLSXData.setVisible(false);
    colItemTableXLSX.removeAllCells();

    modelTableXLSXData.setData([]);
    modelTableXLSXData.refresh();

    ButtonSave.setEnabled(false);
}
