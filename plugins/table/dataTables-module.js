function updateDataTableSelectAllCtrl(table)
{
	var $table             = table.table().node();
	var $chkbox_all        = $('tbody input[type="checkbox"]', $table);
	var $chkbox_checked    = $('tbody input[type="checkbox"]:checked', $table);
	var chkbox_select_all  = $('thead input[name="select_all"]', $table).get(0);

	if($chkbox_checked.length === 0)
	{
		chkbox_select_all.checked = false;
		if('indeterminate' in chkbox_select_all)
		{
			chkbox_select_all.indeterminate = false;
		}
	}
	else if ($chkbox_checked.length === $chkbox_all.length)
	{
		chkbox_select_all.checked = true;
		if('indeterminate' in chkbox_select_all)
		{
			chkbox_select_all.indeterminate = false;
		}

	}
	else
	{
		chkbox_select_all.checked = true;
		if('indeterminate' in chkbox_select_all)
		{
			chkbox_select_all.indeterminate = true;
		}
	}
}

$(document).ready(function (){
	var data_text_center = $("#table-data").data("text-center");
	var data_text_right = $("#table-data").data("text-right");
	var data_order = $("#table-data").data("order");
	var data_link = $("#table-data").data("link");


	var rows_selected = [];
	var table = $('#table-data').DataTable({
		"processing": true,
		"serverSide": true,
		"order": [],
		"paging": true,
		"lengthChange": true,
		"searching": true,
		"ordering": true,
		"info": true,
		"autoWidth": true,
		"ajax": {
			"url": base_url+data_link,
			"type": "POST"
		},
		'columnDefs': [{
			'targets': 0,
			'searchable': false,
			'orderable': false,
			'width': '1%',
			'className': 'dt-body-center',
			'render': function (data, type, full, meta){
				return '<input type="checkbox">';
			}
		},{ 
            "targets": data_order,
            "orderable": false
        },{
            "targets": data_text_center,
            "className": "text-center",
        },{
            "targets": data_text_right,
            "className": "text-right",
        }],
		'rowCallback': function(row, data, dataIndex){
			var rowId = data[0];
			if($.inArray(rowId, rows_selected) !== -1)
			{
				$(row).find('input[type="checkbox"]').prop('checked', true);
				$(row).addClass('selected');
			}
		}
	});

	$('#table-data tbody').on('click', 'input[type="checkbox"]', function(e)
	{
		var $row = $(this).closest('tr');
		var data = table.row($row).data();
		var rowId = data[0];
		var index = $.inArray(rowId, rows_selected);
		if(this.checked && index === -1)
		{
			rows_selected.push(rowId);
		} 
		else if (!this.checked && index !== -1)
		{
			rows_selected.splice(index, 1);
		}

		if(this.checked)
		{
			$row.addClass('selected');
		} 
		else 
		{
			$row.removeClass('selected');
		}
		updateDataTableSelectAllCtrl(table);
		if(rows_selected.length > 0)
		{
			$(".row-select").fadeIn("3000").removeClass("d-none");
			$(".row-select strong").text(rows_selected.length);
			$("input[name=array_id]").val(rows_selected);
		}
		else
		{
			$(".row-select").fadeOut("3000");
		}
		e.stopPropagation();
	});

	$('#table-data').on('click', 'tbody td', function(e)
	{
		window.location.href = $(this).parent().find('td:eq(1) .dt-index').text();
	});

	$('thead input[name="select_all"]', table.table().container()).on('click', function(e)
	{
		if(this.checked)
		{
			$('#table-data tbody input[type="checkbox"]:not(:checked)').trigger('click');
		} 
		else 
		{
			$('#table-data tbody input[type="checkbox"]:checked').trigger('click');
		}
		e.stopPropagation();
	});

	table.on('draw', function(){
		var table_select = document.getElementById('table-select');
		if(table_select == null)
		{		
			$(".display.table").parent().prepend('<div id="table-select" class="row-select fontsize-smaller mt-3 border p-3 d-none"><strong>2</strong> data terpilih <button class="btn btn-outline-danger btn-sm ml-2" data-toggle="modal" data-target="#delete-form">Hapus Data</button></div>');
			updateDataTableSelectAllCtrl(table);
		}
	    $.getScript(base_url+'plugins/table/dataTables-addons.js', function(){
	    });
	});

});