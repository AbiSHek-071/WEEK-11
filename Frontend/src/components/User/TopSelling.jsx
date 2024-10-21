const TopSelling = () => {
 const products = [
   {
     name: "H&M Relaxed Fit Overshirt",
     description:
       "Comfortable and stylish relaxed fit overshirt with creative graphic print on the back. Perfect for casual outings.",
     price: 2500,
     image:
       "https://res.cloudinary.com/dneqndzyc/image/upload/v1729066989/uckdxxrnxkrcqmbrdg65.jpg",
   },
   {
     name: "Casual Graphic Tee",
     description:
       "Soft cotton t-shirt with unique graphic design. Great for everyday wear and self-expression.",
     price: 1299,
     image:
       "https://res.cloudinary.com/dneqndzyc/image/upload/v1729164638/ghmiwpdavbtszjf9xcit.jpg",
   },
   {
     name: "Urban Street Hoodie",
     description:
       "Cozy hoodie with modern street-style graphics. Ideal for layering in cooler weather.",
     price: 1999,
     image:
       "https://www.snitch.co.in/cdn/shop/files/4MSO4576-0311.jpg?v=1728648286&width=1800",
   },
   {
     name: "Vintage Wash Denim Jacket",
     description:
       "Classic denim jacket with a vintage wash. A versatile piece for any wardrobe.",
     price: 3500,
     image:
       "https://www.snitch.co.in/cdn/shop/files/4MSO4576-0311.jpg?v=1728648286&width=1800",
   },
 ];

  return (
    <section className='py-12'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='text-2xl font-bold mb-6'>Top Selling</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {products.map((product) => (
            <div
              key={product.id}
              className='bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center'>
              <img
                src={product.imageUrl}
                alt={product.title}
                className='w-full object-cover'
              />
              <div className='p-4 text-center'>
                <h3 className='font-semibold mb-2'>{product.title}</h3>
                <p className='text-sm text-gray-600 mb-2'>{product.price}</p>
                <p className='font-bold mb-2'>{product.sizes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSelling;
