$(document).ready(function() {

  // экспериментальный массив объектов
  var data = [];

  for(var i=1; i<=1000; i++) {
    data.push({
      name: 'User ' + i,
      description: 'Description for user ' + i,
    });
  }

  // data.forEach(function(item, i, arr) {
  //   $('#content-block .content').append('<p>' + item.name + ' => ' + item.description + '</p>');
  // });

  function customPager(options = { data: null, pagerCount: 10, itemsCount: 10, dataHandler: null }) {
    // options => {
    //   data: массив объектов с данными
    //   pagerCount: количество кнопок (default = 10)
    //   itemsCount: количество элементов на одной странице (default = 10)
    // }

    pagerCount = options.pagerCount = options.pagerCount || 10;
    itemsCount = options.itemsCount = options.itemsCount || 10;
    data       = options.data;

    // выборка элементов пейджера
    var firstPageBtn  = $('#first-page');
    var prevPageBtn   = $('#prev');
    var pages         = $('#pages');
    var nextPageBtn   = $('#next');
    var lastPageBtn   = $('#last-page');

    // количество объектов в массиве
    var dataItemsCount = data.length;

    // количество страниц
    var pagesCount = Math.ceil(dataItemsCount / itemsCount);

    // если количество меньше или равняется значению установленного параметра
    // то просто запускаем функцию-обработчик данных и передаем ей исходный массив объектов
    if(pagesCount <= 1) {
      if(typeof dataHandler === 'function') dataHandler(data);
      return;
    }

    // если количество страниц не превышает установленное значение в настройках,
    // то просто выводим пейджеры
    else if(pagesCount <= pagerCount) {
      for(var i=1; i<=pagesCount; i++) {
        pages.append('<span ' + ((i==1) ? 'class="active"' : '') + '>' + i + '</span>');
      }
    }

    // если же превышает, то активируем кнопочку "Вперед"
    else {
      for(var i=1; i<=pagerCount; i++) {
        pages.append('<span ' + ((i==1) ? 'class="active"' : '') + '>' + i + '</span>');
      }
      nextPageBtn.addClass('visible');
      // если превышает больше, чем в 2 раза, то активируем и кнопочку "Последняя"
      if((pagesCount / pagerCount) > 2) {
        lastPageBtn.addClass('visible');
      }
    }

    // а в обработчик передаем только первые itemsCount элементов
    if(typeof dataHandler === 'function') dataHandler(data.slice(0, itemsCount));

    // обработчик клика по пейджерам
    $('#pages').on('click', 'span', function() {
      pageNumber = +$(this).text();
      $(this).addClass('active').siblings('.active').removeClass('active');
      if(typeof dataHandler === 'function') {
        var begin = (pageNumber * itemsCount) - itemsCount;
        var end = begin + itemsCount;
        dataHandler(data.slice(begin, end));
      }
    });

// ----------------------------------------------------------------
//              Обработчик клика по кнопке "Вперед"
// ----------------------------------------------------------------

    $('#pager').on('click', '#next', function() {
      // последний номер страницы
      var lastPageNumber = +pages.find('span:last').text();

      // если уж пошли вперед, то надо дать возможность вернуться назад :)
      $('#prev').addClass('visible');

      // если ушли далеко вперед (дальше второй линейки пейджеров),
      // то даем возможность вернуться в самое начало
      if(lastPageNumber + 1 > 2 * pagerCount) {
        $('#first-page').addClass('visible');
      }

      // если следующая линейка страниц будет предпоследней,
      // то нет смысла отображать кнопку "Последняя"
      if(dataItemsCount <= lastPageNumber * itemsCount + pagerCount * itemsCount * 2) {
        lastPageBtn.removeClass('visible');
      }

      // если следующая линейка страниц будет последней,
      // то нет смысла отображать кнопочку "Вперед"
      if(dataItemsCount <= lastPageNumber * itemsCount + pagerCount * itemsCount) {
        $(this).removeClass('visible');
      }

      // заполняем новые номера страниц
      pages.empty();
      for(var i=lastPageNumber + 1; i<=lastPageNumber + pagerCount; i++) {
        // есть смысл выводить пейджер только в том случае,
        // если он будет соответствовать хотя бы одной записи в контенте
        if(data[i*itemsCount - itemsCount]) {
          pages.append('<span ' + ((i==lastPageNumber + 1) ? 'class="active"' : '') + '>' + i + '</span>');
        }
      }

      // запускаем функцию-обработчик данных и передаем ей 
      // соответствующий массив объектов
      if(typeof dataHandler === 'function') {
        var begin = lastPageNumber * pagerCount;
        var end = begin + itemsCount;
        dataHandler(data.slice(begin, end));
      }
    });

// ----------------------------------------------------------------
//              Обработчик клика по кнопке "Последняя"
// ----------------------------------------------------------------
    
    $('#pager').on('click', '#last-page', function() {
      // если идем в самый конец, то надо дать возможность
      // вернуться в самое начало и назад
      $('#first-page, #prev').addClass('visible');

      // а кнопочки "Вперед" и "Последняя" больше не нужны вовсе,
      // потому как мы перемещаемся на последнюю линейку пейджеров
      $(this).add('#next').removeClass('visible');

      // вычисляем номера первого и последнего пейджера на последней линейке
      var lastPagerNumber = Math.ceil(dataItemsCount / itemsCount);
/*!!*/var firstPagerNumber = Math.floor(dataItemsCount / (itemsCount * pagerCount)) * pagerCount + 1;

      // очищаем все пейджеры
      pages.empty();

      // зполняем новыми пейджерами, которые соответствуют последней линейке
      for(var i=firstPagerNumber; i<=lastPagerNumber; i++) {
        pages.append('<span ' + ((i==lastPagerNumber) ? 'class="active"' : '') + '>' + i + '</span>');
      }

      // чтобы не вычислять подмассив данных, который нужно передать функции обработчику,
      // просто имитируем клик по последнему пейджеру :)
      pages.find('span:last').trigger('click');
      
    });

// ----------------------------------------------------------------
//              Обработчик клика по кнопке "Назад"
// ----------------------------------------------------------------

    $('#pager').on('click', '#prev', function() {
      // первый номер пейджера
      var firstPageNumber = +pages.find('span:first').text();

      // если уж пошли назад, то надо дать возможность пойти вперед :)
      $('#next').addClass('visible');

      // если ушли далеко назад (дальше предпоследней линейки пейджеров),
      // то даем возможность перейти в самый конец
      if(true) {
        $('#last-page').addClass('visible');
      }

      // если следующая линейка пейджеров будет второй от начала,
      // то прячем кнопку "Первая"


      // если следующая линейка будет первой от начала, то прячем
      // кнопочку "Назад"


      // показываем pageCount предыдущих пейджеров
      var begin = firstPageNumber - pagerCount;
      var end = firstPageNumber - 1;
      pages.empty();
      for(var i=begin; i<=end; i++) {
        pages.append('<span ' + ((i == begin) ? 'class="active"' : '') + '>' + i + '</span>');
      }

      // имитируем клик по первому пейджеру
      pages.find('span:first').trigger('click');

    });


// ----------------------------------------------------------------
//              Обработчик клика по кнопке "Первая"
// ----------------------------------------------------------------

    $('#first-page').click(function() {
      // скрываем кнопочки "Первая" и "Назад"
      $('#first-page, #prev').removeClass('visible');

      // показываем кнопочки "Вперед" и "Последняя"
      $('#next, #last-page').addClass('visible');

      // строим пейджеры от 1 до pageCount
      // заполняем новые номера страниц
      pages.empty();
      for(var i=1; i<=pagerCount; i++) {
        pages.append('<span ' + ((i== 1) ? 'class="active"' : '') + '>' + i + '</span>');
      }

      // имитируем клик по первому пейджеру
      pages.find('span:first').trigger('click');
    });

  }

  // практическое использование функции
  customPager({data: data, itemsCount: 10, pagerCount: 10, dataHandler: dataHandler});

  // функция-обработчик данных
  function dataHandler(data) {
    $('#content-block .content').empty();
    data.forEach(function(item, i, arr) {
      $('#content-block .content').append('<p>' + item.name + ' => ' + item.description + '</p>');
    });
  }
});