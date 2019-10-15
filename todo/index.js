/* eslint-disable linebreak-style */
$(document).ready(() => {
  const $todoButton = $('#todo-button');
  const $todoInput = $('#todoInput');
  const $deleteCompleteTasks = $('#delete-complete-tasks');
  const $deleteAll = $('#delete-all');
  const TODO_ON_PAGE = 5;
  const BUTTON_ENTER = 13;

  let mass = [];
  let complete = [];
  let laziness = [];
  let choice = 'all';
  let nowPage = 1;
  let howMachPage;
  let isEveryChecked;

  const countTrue = function() {
    complete = mass.filter(item => item.checked === true);
    const { length: lengthTrue } = complete;


    $('#complete-true').html(lengthTrue);
    laziness = mass.filter(item => item.checked === false);
    const { length: lengthFalse } = laziness;


    $('#complete-false').html(lengthFalse);
  };


  const pagination = function(glob) {
    howMachPage = Math.ceil(glob.length / TODO_ON_PAGE);
    if (nowPage > howMachPage) {
      nowPage = howMachPage;
    }
    if (howMachPage < 1) howMachPage = 1;
    $('#pagination').html('');
    if (howMachPage > 1) {
      let stringPagination = '<nav aria-label="Page navigation example ">'
+ ` <ul class="pagination">`
+ ` <li id = left class="page-item ${nowPage === 1 ? 'disabled' : ''} "> `
+ ' <a class="page-link" href="#" aria-label="Previous"> '
+ '<span aria-hidden="true">&laquo;</span></a></li>';

      for (let i = 1; i <= howMachPage; ++i) {
        stringPagination += `
      <li id=${i} class="page-item pgntn ${i === nowPage ? 'active' : ''}">
      <a class="page-link" href="#">${i}</a></li>`;
      }
      stringPagination
      += `<li id = right 
        class="page-item ${howMachPage === nowPage ? 'disabled' : ''}">
      <a class="page-link" href="#" aria-label="Next">
      <span aria-hidden="true">&raquo;
      </span></a></li ></ul></nav>`;
      $(`#pagination`).html(stringPagination);
    }

    let str = '';

    if (howMachPage < nowPage) {
      nowPage = howMachPage;
    }

    glob.forEach((item, i) => {
      if ((nowPage - 1) * TODO_ON_PAGE <= i && i < nowPage * TODO_ON_PAGE) {
        str += `<tr class="middle-pag">
         <td id="${item.id}">
          <input type="checkbox" 
            class="check-todo " ${item.checked ? 'checked' : ''} />
         </td>
      <td id="${item.id}"class="middle-pag__text">
      <span class="text-todo"> 
      ${item.text}
       </span> </td>
      <td id="${item.id}" > <button class="delete-td btn btn-outline-danger"> X 
      </button></td>
      </tr>`;
      }
    });

    return str;
  };

  const render = function(glob) {
    if (mass.length) {
      isEveryChecked = mass.every(item => item.checked);
    } else {
      isEveryChecked = false;
    }
    $('#checkbox-all').prop('checked', isEveryChecked);
    $(`#out-todo`).html(pagination(glob));
  };

  const verification = function() {
    countTrue();
    if (choice === 'com') {
      render(complete);
    } else if (choice === 'laz') {
      render(laziness);
    } else {
      render(mass);
    }
  };

  const addListTask = function() {
    const text = $todoInput.val().trim()
      .replace(/&/gu, '&amp;')
      .replace(/~/gu, '')
      .replace(/"/gu, '&quot;')
      .replace(/#/gu, '')
      .replace(/</gu, '&lt;')
      .replace(/>/gu, '&gt;')
      .replace(/'/gu, '&#39;');

    const newTodo = {
      checked: false,
      id: Date.now(),
      text: text.trim(),
    };

    if (text === '') return;
    mass.unshift(newTodo);
    $todoInput.prop('value', '');
    verification();
  };

  $deleteAll.on('click', () => {
    mass = [];
    verification();
  });

  $deleteCompleteTasks.on('click', () => {
    mass = mass.filter(item => !item.checked);
    verification();
  });

  $todoButton.on('click', () => {
    nowPage = 1;
    choice = 'all';
    addListTask();
    $('.marker').addClass('btn-success');
    $('.marker').removeClass('btn-warning');
    $(`#show-all`).removeClass('btn-success')
      .addClass('btn-warning');
    verification();
  });

  $(document).on(`dblclick`, `.text-todo`, function() {
    $(this).replaceWith(`<input type="text.val" 
                            id="newText"
                            class="new-input form-control"
                            value="${$(this).text()}"/>`);
    $('#newText').focus();
    $(document).on('blur', `.new-input`, function(blurFun) {
      blurFun.which = BUTTON_ENTER;
      const id = parseInt($(this).parent()
        .attr(`id`));
      const newText = $(this).val()
        .trim()
        .replace(/&/gu, '&amp;')
        .replace(/~/gu, '')
        .replace(/"/gu, '&quot;')
        .replace(/#/gu, '')
        .replace(/</gu, '&lt;')
        .replace(/>/gu, '&gt;')
        .replace(/'/gu, '&#39;');

      mass.forEach(item => {
        if (id === item.id) {
          if (newText !== '') {
            item.text = newText;
          }
        }
      });
      verification();
    });
  });

  $(document).on('keypress', `.new-input`, function(ent) {
    if (ent.which === BUTTON_ENTER) {
      const id = parseInt($(this).parent()
        .attr(`id`));
      const newText = $(this).val()
        .trim()
        .replace(/&/gu, '&amp;')
        .replace(/~/gu, '')
        .replace(/"/gu, '&quot;')
        .replace(/#/gu, '')
        .replace(/</gu, '&lt;')
        .replace(/>/gu, '&gt;')
        .replace(/'/gu, '&#39;');

      mass.forEach(item => {
        if (id === item.id) {
          if (newText !== '') {
            item.text = newText;
          }
        }
      });
      verification();
    }
  });


  $(document).on(`click`, '#left', () => {
    if (nowPage > 1) --nowPage;
    verification();
  });

  $(document).on(`click`, '#right', () => {
    if (nowPage < howMachPage) ++nowPage;
    verification();
  });

  $(document).on(`click`, '.pgntn', function() {
    nowPage = parseInt($(this).attr(`id`));

    verification();
  });

  $(document).on(`change`, `.check-todo`, function() {
    const changeCheck = parseInt($(this).parent()
      .attr(`id`));


    mass.forEach(item => {
      if (changeCheck === item.id) {
        item.checked = !item.checked;
      }
    });
    verification();
  });

  $(document).on('click', '.delete-td', function() {
    const clickDelete = parseInt($(this).parent()
      .attr(`id`));


    mass.forEach((item, index) => {
      if (clickDelete === item.id) {
        mass.splice(index, 1);
      }
      if (nowPage > howMachPage) {
        nowPage = howMachPage;
      }
      verification();
    });
  });

  $(`#todoInput`).on('keypress', ent => {
    if (ent.which === BUTTON_ENTER) {
      nowPage = 1;
      choice = 'all';
      addListTask();
      $('.marker').addClass('btn-success');
      $('.marker').removeClass('btn-warning');
      $(`#show-all`).removeClass('btn-success')
        .addClass('btn-warning');
      verification();
    }
  });

  $('#checkbox-all').on('change', () => {
    const check = $('#checkbox-all').prop(`checked`);


    mass.forEach(item => {
      item.checked = check;
    });
    nowPage = 1;
    verification();
  });

  const marking = function(thisButton) {
    $('.marker').addClass('btn-success');
    $('.marker').removeClass('btn-warning');
    thisButton.removeClass('btn-success').addClass('btn-warning');
  };

  $(document).on('click', '#button-complete-true', function() {
    marking($(this));
    choice = 'com';
    if (nowPage === 0) nowPage = 1;
    verification();
  });

  $(document).on('click', '#button-complete-false', function() {
    if (nowPage === 0) nowPage = 1;
    choice = 'laz';
    marking($(this));
    verification();
  });

  $(document).on('click', '#show-all', function() {
    if (nowPage === 0) nowPage = 1;
    choice = 'all';
    marking($(this));
    verification();
  });
});
