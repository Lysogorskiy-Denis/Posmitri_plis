$(document).ready(() => {
  const $todoBTN = $('#todoBtn');
  const $todoInput = $('#todoInput');
  const $DltCTasks = $('#DeleteCTasks');
  const $dltAll = $('#deleteAll');
  const todoOnPage = 5;
  const btnEnter = 13


  let mass = [];
  let complete = [];
  let laziness = [];
  let choice = 'all';
  let nowPage = 1;
  let howMachPage;

  function countTrue() {
    complete = mass.filter(item => item.checked === true);
    lengthTrue = complete.length;
    $('#completeTrue').html(lengthTrue);
    laziness = mass.filter(item => item.checked === false);
    lengthFalse = laziness.length;
    $('#completeFalse').html(lengthFalse);
  }

  function verification() {
    countTrue();
    if (choice === 'com') {
      render(complete);
    } else if (choice === 'laz') {
      render(laziness);
    } else {
      render(mass);
    }
  }

  function AddListTask() {
    const text = $todoInput.val().trim().replace(/&/g, '&amp;')
      .replace(/~/g, '').replace(/{/g, '').replace(/"/g, '&quot;')
      .replace(/#/g, '').replace(/</g, '&lt;').replace(/}/g, '')
      .replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/[=]/g, '&#x3D;');

    const newTodo = {
      text: text.trim(),
      checked: false,
      id: Date.now(),
    };

    if (text === '') return;
    mass.unshift(newTodo);
    $todoInput.prop('value', '');
    verification();
  }

  $dltAll.on('click', () => {
    mass = [];
    verification();
  });

  $DltCTasks.on('click', () => {
    mass = mass.filter(function(item) {
      return !item.checked;
    });
    verification();
  });

  $todoBTN.on('click', () => {
    nowPage = 1;
    AddListTask();
  });

  $(document).on(`dblclick`, `.text-todo`, function() {
    $(this).replaceWith(`<input type="text.val" 
                            id="newText"
                            class="new-input"
                            value="${$(this).text()}"/>`);
    $('#newText').focus();
  });

  $(document).on('keypress', `.new-input`, function(ent) {
    if (ent.which === btnEnter) {
      const id = $(this).parent().attr(`id`);
      const newText = $(this).val().trim().replace(/'/g, '&#39;')
        .replace(/&/g, '&amp;').replace(/~/g, '').replace(/{/g, '')
        .replace(/"/g, '&quot;').replace(/#/g, '').replace(/</g, '&lt;')
        .replace(/}/g, '').replace(/>/g, '&gt;').replace(/[=]/g, '&#x3D;');

      mass.forEach(item => {
        if (id == item.id) {
          if (newText !== '') {
            item.text = newText;
          }
        }
      });
      verification();
    }
  });

function pagination(glob){
  howMachPage = Math.ceil(glob.length / todoOnPage);
  if(nowPage > howMachPage){
    nowPage = howMachPage;
  }
  if (howMachPage < 1) howMachPage = 1;
  $('#pagination').html('');
  if (howMachPage > 1) {
    let stringPagination = '<nav aria-label="Page navigation example ">'
                          + ` <ul class="pagination"> <li id = left class="page-item ${nowPage == 1 ? 'disabled' : ''} "> `
                          + ' <a class="page-link" href="#" aria-label="Previous"> '
                          + '<span aria-hidden="true">&laquo;</span></a></li>';

    for (i = 1; i <= howMachPage; ++i) {
      stringPagination += `
      <li id=${i} class="page-item pgntn ${i == nowPage ? 'active' : ''}"><a class="page-link" href="#">${i}</a></li>`;
      console.log(nowPage);
      console.log("howMachPage", howMachPage);

    }
    stringPagination += `<li id = right class="page-item ${howMachPage == nowPage ? 'disabled' : ''}"><a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li ></ul></nav>`;
    $(`#pagination`).html(stringPagination);
  }

  let str = '';


  if (howMachPage < nowPage) {
    nowPage = howMachPage;
  }

 
  glob.forEach((item, i) => {
    if ((nowPage - 1) * todoOnPage <= i && i < nowPage * 5) {
      str += `<tr class="midle-pag"> <td id="${item.id}"><input type="checkbox" class="check-todo " ${item.checked ? 'checked' : ''} /></td>
      <td id="${item.id}" >  <span class="text-todo"> ${item.text} </span> </td>
      <td id="${item.id}" >  <button class="delete-td btn btn-outline-danger"> X </button></td>
      </tr>`;
    }
  });

  return str;

}

  function render(glob) {
    const isEveryChecked = mass.every(item => item.checked);
    $('#checkbox-all').prop('checked', isEveryChecked);
    
    
    $(`#out-todo`).html(pagination(glob));
    
  }

  $(document).on(`click`, '#left', () => {
    if (nowPage > 1) --nowPage;
    verification();
  });

  $(document).on(`click`, '#right', () => {
    if (nowPage < howMachPage)  ++nowPage;
   
    verification();
  });

  $(document).on(`click`, '.pgntn', function() {
    nowPage = $(this).attr(`id`);
    verification();
  });

  $(document).on(`change`, `.check-todo`, function() {
    const a = $(this).parent().attr(`id`);
    mass.forEach(item => {
      if (a == item.id) {
        item.checked = !item.checked;
      }
    });
    verification();
  });

  $(document).on('click', '.delete-td', function() {
    const b = $(this).parent().attr(`id`);
    
    mass.forEach((item, index) => {
      if (b == item.id) {
        mass.splice(index, 1);
      }
      if(nowPage > howMachPage){
        nowPage = howMachPage;
      }
      verification();
    });
  });

  $(`#todoInput`).on('keypress', ent => {
    if (ent.which === btnEnter) {
      nowPage = 1;
      AddListTask();
    }
  });

  $('#checkbox-all').on('change', () => {
    const check = $('#checkbox-all').prop(`checked`);
    mass.forEach(item => {
      item.checked = check;
    });
    verification();
  });

  function marking(thisButton) {
    $('.marker').addClass('disabled');
    thisButton.removeClass('disabled').addClass('active');
  }

  $(document).on('click', '#btnCompleteTrue', function() {
    marking($(this));
    choice = 'com';
    verification();
  });

  $(document).on('click', '#btnCompleteFalse', function() {
    choice = 'laz';
    marking($(this));
    verification();
  });

  $(document).on('click', '#showAll', function() {
    choice = 'all';
    marking($(this));
    verification();
  });
});
