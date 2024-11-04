import View from './View.js';
import icons from 'url:../../img/icons.svg';

class paginationView extends View{
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(Hanlder) {
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');

            if(!btn) return;

            const goTopage = +btn.dataset.goto;

            Hanlder(goTopage);
        })
    };

    _generateMarkup() {
        const curPage = this._data.page
        const numPages = Math.ceil(this._data.result.length / this._data.resultPerPage);

        const btn = [`
          <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
           `,
           `
          <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
             <svg class="search__icon">
               <use href="${icons}#icon-arrow-left"></use>
              </svg>
             <span>Page ${curPage - 1}</span>
           </button>
            `];

        // Page 1, and there are other pages
        if (curPage === 1 && numPages > 1) {
            return btn[0];
        }

        // Last page
        if (curPage === numPages && numPages > 1) {
            return btn[1];
        }
        
        // Other page
        if (curPage < numPages) {
            return btn;
        }

        // Page 1, and there are No other pages
        return '';
    }
}

export default new paginationView();