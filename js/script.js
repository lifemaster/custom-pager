$(document).ready(function() {

  $('#controls-content button').click(function() {
    var dataItemsCount  = +$('#data-value').val();
    var itemsCount      = +$('#items-count').val();
    var pagerCount      = +$('#pager-count').val();

    var result =  dataItemsCount > 0 && dataItemsCount % 1 === 0 &&
                  itemsCount     > 0 && itemsCount     % 1 === 0 &&
                  pagerCount     > 0 && itemsCount     % 1 === 0;


    if(result) {
      // экспериментальный массив объектов
      var data = [];

      for(var i=1; i<=dataItemsCount; i++) {
        data.push({
          name:        'User '                 + i,
          description: 'Description for user ' + i,
        });
      }

      // очищаем блок контента и пейджера
      $('#content-block .content, .pages').empty();

      // скрываем кнопочки управления
      $('.first-page, .prev, .next, .last-page').removeClass('visible');

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