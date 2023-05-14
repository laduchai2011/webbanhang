import { createStore } from 'redux';

function counterReducer(state = null , action) {
    switch (action.type) {
        case 'viewProduct-productBox-productInforBlock':
            return action;

        case 'addCart':
            return action;

        case 'requireInbox':
            return action;
        
        case 'saveMessageQueue':
            return action;

        case 'joinInbox':
            return action;
        
        default:
            return state;
    }
}

export const reduxStore = createStore(counterReducer);

// action in product/productBox-productInforBlock
/**
*@typedef {
*type: 'viewProduct-productBox-productInforBlock'
*data: object
*} detailView_action
*/
