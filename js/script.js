$(document).ready(function() {

  $('#controls-content button').click(function() {
    var dataItemsCount  = +$('#data-value').val();
    var itemsCount      = +$('#items-count').val();
    var pagerCount      = +$('#pager-count').val();

    var result =  dataItemsCount > 0 && dataItemsCount % 1 === 0 &&
                  itemsCount     > 0 && itemsCount     % 1 === 0 &&
                  pagerCount     > 0 && itemsCount     % 1 === 0;


    if(result) {

      // не допускаем делать больше 10 пейджеров
      if(pagerCount > 10) {
        alert('Не надо делать больше 10 пейджеров.\nОни же не влезут :)');
        return;
      }
      
      // экспериментальный массив объектов
      var data = [];

      for(var i=1; i<=dataItemsCount; i++) {
        data.push({
          name:        'User '                 + i,
          description: 'Description for user ' + i,
        });
      }

      // очищаем блок контента
      $('#content-block .content').empty();

      // пересоздаем пейджер
      $('.pager').remove();

      $('#content-block').after(
        '<div class="pager">\
          <div class="pager-content">\
            <div class="first-page">Первая</div>\
            <div class="prev">Назад</div>\
            <div class="pages"></div>\
            <div class="next">Вперед</div>\
            <div class="last-page">Последняя</div>\
          </div>\
        </div>'
      );

      // запускаем плагин custom-pager
      $('.pager').pager({
        pagerCount: pagerCount,
        itemsCount: itemsCount,
        data: data,
        dataHandler: dataHandler
      });
    }
    else {
      alert('Введите во все поля целые числа больше нуля!');
    }
  });

  // функция-обработчик данных
  function dataHandler(data) {
    $('#content-block .content').empty();
    data.forEach(function(item, i, arr) {
      $('#content-block .content').append('<p>' + item.name + ' => ' + item.description + '</p>');
    });
  }
});