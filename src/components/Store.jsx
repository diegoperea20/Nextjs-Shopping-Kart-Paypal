import "./store.css"
import Link from 'next/link';

async function getData() {
    const res = await fetch('http://localhost:3000/api/store')
    const data = await res.json()
    return data
}



async function Store() {
  const data = await getData();
    
      
  return (
    
    <div className="container">
        <button className="button-kart" ><Link href="/home/store/kart">Go to kart 🛒</Link> </button>
      <h1 className='title'>Store</h1>
      
     
      <div className="cardContainer">
      {/* La función slice(0, 20) tomará los primeros 20 elementos del arreglo data */}
      {/* si no se quiere usar filtro cambiar abajo filteredData.slice por data.slice */}
      {
          data.slice(0, 20)
          .map((product) => (
            <Link href={`/home/store/${product.id}`} key={product.id}>
            <div key={product.id} className="card">
              
                <img src={product.image} alt={product.name} className="image" />
          
              <h3 className="name">{product.title}</h3>
              <p className="value">Description: {product.description}</p>
              <br/>
              <p className="value">Price: ${product.price}</p>

            </div>
            </Link>
          ))}
      </div>
      <div>
      
      </div>
    </div>
  )
}

export default Store