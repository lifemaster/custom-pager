(function($) {

  $.fn.pager = function(options) {

    // options => {
    //   data: массив объектов с данными
    //   pagerCount: количество кнопок (default = 10)
    //   itemsCount: количество элементов на одной странице (default = 10)
    // }

    // если источник данных является пустым массивом или не массивом вообще,
    // то не смысла делать что-либо дльше
    if({}.toString.call(options.data).slice(8, -1) !== 'Array' || !options.data.length) return;

    // также нет смысла дальше продолжать,
    // если не задана функция-обработчик данных
    if(typeof options.dataHandler !== 'function') return;
    
    // выборка элементов пейджера
    var firstPageBtn  = this.find('.first-page');
    var prevPageBtn   = this.find('.prev');
    var pages         = this.find('.pages');
    var nextPageBtn   = this.find('.next');
    var lastPageBtn   = this.find('.last-page');

    var dataHandler = options.dataHandler;

    // ----------------------------------------------------------------
    //                     Объявление констант
    // ----------------------------------------------------------------

    // количество пейджеров на одной линейке
    var PAGER_COUNT = options.pagerCount = options.pagerCount || 10;

    // количество объектов, которые буду выводится на одной странице
    // (передаваться обработчику данных)
    var ITEMS_COUNT = options.itemsCount = options.itemsCount || 10;

    // массив объектов (источник данных)
    var DATA = options.data;

    // количество объектов в массиве
    var DATA_ITEMS_COUNT = DATA.length;

    // количество страниц
    var PAGES_COUNT = Math.ceil(DATA_ITEMS_COUNT / ITEMS_COUNT);

    // количество линеек пейджера
    var LINES_PAGE_COUNT = Math.ceil(DATA_ITEMS_COUNT / (ITEMS_COUNT * PAGER_COUNT));

    // номер первого пейджера на последней линейке
    var FIRST_PAGE_NUMBER_OF_LAST_LINE = (LINES_PAGE_COUNT - 1) * PAGER_COUNT + 1;

    // ----------------------------------------------------------------
    //               Построение начального вида пагинации
    // ----------------------------------------------------------------    

    // если получается всего одна страница, то просто запускаем 
    // функцию-обработчик данных и передаем ей исходный массив объектов
    if(PAGES_COUNT == 1) {
      dataHandler(DATA);
      return;
    }

    // если количество страниц помещается в одну линейку,
    // то просто выводим пейджеры
    else if(PAGES_COUNT <= PAGER_COUNT) {
      for(var i=1; i<=PAGES_COUNT; i++) {
        pages.append('<span ' + ((i==1) ? 'class="active"' : '') + '>' + i + '</span>');
      }

      this.show();
    }

    // если же превышает, то активируем кнопочку "Вперед"
    else {
      for(var i=1; i<=PAGER_COUNT; i++) {
        pages.append('<span ' + ((i==1) ? 'class="active"' : '') + '>' + i + '</span>');
      }
      nextPageBtn.addClass('visible');

      // если превышает больше, чем в 2 раза, то активируем и кнопочку "Последняя"
      if(PAGES_COUNT / PAGER_COUNT > 2) {
        lastPageBtn.addClass('visible');
      }

      this.show();
    }

    // а в обработчик передаем только первые ITEMS_COUNT элементов
    dataHandler(DATA.slice(0, ITEMS_COUNT));

    // ----------------------------------------------------------------
    //                Обработчик клика по пейджерам
    // ----------------------------------------------------------------

    pages.on('click', 'span', function() {
      pageNumber = +$(this).text();
      $(this).addClass('active').siblings('.active').removeClass('active');
      
      var begin = (pageNumber * ITEMS_COUNT) - ITEMS_COUNT;
      var end = begin + ITEMS_COUNT;
      dataHandler(DATA.slice(begin, end));
    });

    // ----------------------------------------------------------------
    //              Обработчик клика по кнопке "Вперед"
    // ----------------------------------------------------------------

    nextPageBtn.click(function() {
      // последний номер страницы
      var lastPageNumber = +pages.find('span:last').text();

      // если уж пошли вперед, то надо дать возможность вернуться назад :)
      prevPageBtn.addClass('visible');

      // если ушли далеко вперед (дальше второй линейки пейджеров),
      // то даем возможность вернуться в самое начало
      if(lastPageNumber + 1 > 2 * PAGER_COUNT) {
        firstPageBtn.addClass('visible');
      }

      // если следующая линейка страниц будет предпоследней,
      // то нет смысла отображать кнопку "Последняя"
      if(DATA_ITEMS_COUNT <= lastPageNumber * ITEMS_COUNT + PAGER_COUNT * ITEMS_COUNT * 2) {
        lastPageBtn.removeClass('visible');
      }

      // если следующая линейка страниц будет последней,
      // то нет смысла отображать кнопочку "Вперед"
      if(DATA_ITEMS_COUNT <= lastPageNumber * ITEMS_COUNT + PAGER_COUNT * ITEMS_COUNT) {
        $(this).removeClass('visible');
      }

      // заполняем новые номера страниц
      pages.empty();
      for(var i=lastPageNumber + 1; i<=lastPageNumber + PAGER_COUNT; i++) {

        // есть смысл выводить пейджер только в том случае,
        // если он будет соответствовать хотя бы одной записи в контенте
        if(DATA[i*ITEMS_COUNT - ITEMS_COUNT]) {
          pages.append('<span ' + ((i==lastPageNumber + 1) ? 'class="active"' : '') + '>' + i + '</span>');
        }
      }

      // имитируем клик по первому пейджеру
      pages.find('span:first').trigger('click');
    });

    // ----------------------------------------------------------------
    //              Обработчик клика по кнопке "Последняя"
    // ----------------------------------------------------------------
    
    lastPageBtn.click(function() {
      // если идем в самый конец, то надо дать возможность
      // вернуться в самое начало и назад
      firstPageBtn.add(prevPageBtn).addClass('visible');

      // а кнопочки "Вперед" и "Последняя" больше не нужны вовсе,
      // потому как мы перемещаемся на последнюю линейку пейджеров
      $(this).add(nextPageBtn).removeClass('visible');

      // очищаем все пейджеры
      pages.empty();

      // зполняем новыми пейджерами, которые соответствуют последней линейке
      for(var i=FIRST_PAGE_NUMBER_OF_LAST_LINE; i<=PAGES_COUNT; i++) {
        pages.append('<span ' + ((i==PAGES_COUNT) ? 'class="active"' : '') + '>' + i + '</span>');
      }

      // чтобы не вычислять подмассив данных, который нужно передать функции обработчику,
      // просто имитируем клик по последнему пейджеру :)
      pages.find('span:last').trigger('click');
    });

    // ----------------------------------------------------------------
    //              Обработчик клика по кнопке "Назад"
    // ----------------------------------------------------------------

    prevPageBtn.click(function() {
      // первый номер пейджера
      var firstPageNumber = +pages.find('span:first').text();

      // если уж пошли назад, то надо дать возможность пойти вперед :)
      nextPageBtn.addClass('visible');

      // если ушли далеко назад (дальше предпоследней линейки пейджеров),
      // то даем возможность перейти в самый конец
      if(PAGES_COUNT - (firstPageNumber - 1) > PAGER_COUNT) {
        lastPageBtn.addClass('visible');
      }

      // если следующая линейка пейджеров будет второй от начала,
      // то прячем кнопку "Первая"
      if(firstPageNumber == PAGER_COUNT * 2 + 1) {
        firstPageBtn.removeClass('visible'); 
      }

      // если следующая линейка будет первой от начала, то прячем
      // кнопочку "Назад"
      if(firstPageNumber == PAGER_COUNT + 1) {
        prevPageBtn.removeClass('visible');
      }

      // показываем pageCount предыдущих пейджеров
      var begin = firstPageNumber - PAGER_COUNT;
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

    firstPageBtn.click(function() {
      // скрываем кнопочки "Первая" и "Назад"
      firstPageBtn.add(prevPageBtn).removeClass('visible');

      // показываем кнопочки "Вперед" и "Последняя"
      nextPageBtn.add(lastPageBtn).addClass('visible');

      // строим пейджеры от 1 до pageCount
      // заполняем новые номера страниц
      pages.empty();
      for(var i=1; i<=PAGER_COUNT; i++) {
        pages.append('<span ' + ((i== 1) ? 'class="active"' : '') + '>' + i + '</span>');
      }

      // имитируем клик по первому пейджеру
      pages.find('span:first').trigger('click');
    });
  }

})(jQuery);