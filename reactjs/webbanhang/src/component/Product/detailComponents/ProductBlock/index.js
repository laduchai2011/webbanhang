import React, { memo } from 'react';
import './styles.css';

import ProductBox from './ProductBox';
import { useMediaQuery } from 'react-responsive';


/** 
*@typedef ProductBlockOptions: array
*/

const ProductBlock = ({props}) => {

    // respinsive /* samsung galaxy A51/71: 412px*/
    const isSamsungGalaxy = useMediaQuery({
        query: '(max-width: 500px)'
    })

    return (
        <div className="ProductBlock">
            {
                isSamsungGalaxy ? 
                <div>
                    <div>
                        <div style={{backgroundColor: 'red'}}>
                            {props.length > 0 ? <ProductBox props={props[0]} />:<div className='ProductBlock-box'></div>}
                        </div>
                        <div style={{backgroundColor: 'blue'}}>
                            {props.length > 1 ? <ProductBox props={props[1]} />:<div className='ProductBlock-box'></div>}
                        </div>   
                    </div>
                    <div>
                        <div style={{backgroundColor: 'yellow'}}>
                            {props.length > 2 ? <ProductBox props={props[2]} />:<div className='ProductBlock-box'></div>}
                        </div>
                        <div style={{backgroundColor: 'black'}}>
                            {props.length > 3 ? <ProductBox props={props[3]} />:<div className='ProductBlock-box'></div>}
                        </div>                    
                    </div>
                </div>:
                <div>
                    {props.length > 0 ? <ProductBox props={props[0]} />:<div className='ProductBlock-box'></div>}
                    {props.length > 1 ? <ProductBox props={props[1]} />:<div className='ProductBlock-box'></div>}
                    {props.length > 2 ? <ProductBox props={props[2]} />:<div className='ProductBlock-box'></div>}
                    {props.length > 3 ? <ProductBox props={props[3]} />:<div className='ProductBlock-box'></div>}
                </div>
            }
            {/* {props.length > 0 ? <ProductBox props={props[0]} />:<div className='ProductBlock-box'></div>}
            {props.length > 1 ? <ProductBox props={props[1]} />:<div className='ProductBlock-box'></div>}
            {props.length > 2 ? <ProductBox props={props[2]} />:<div className='ProductBlock-box'></div>}
            {props.length > 3 ? <ProductBox props={props[3]} />:<div className='ProductBlock-box'></div>} */}
        </div>
    )
}

export default memo(ProductBlock);