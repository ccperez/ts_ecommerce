interface RatingProps {
	rating: number,
	numReviews?: number,
	caption?: string
}

export default function Rating({ rating, numReviews, caption }: RatingProps) {

	return (
		<div className="rating">
			{[1, 2, 3, 4, 5].map((r, i) => (
				<span key={`rt_${r}`}>
					<i
						className={
							rating >= r
								? 'fas fa-star'
								: rating >= i + 0.5
									? 'fas fa-star-half-alt'
									: 'far fa-star'
						}
					/>
				</span>
			))}
			{caption ? (
				<span>{caption}</span>
			) : numReviews != 0 ? (
				<span>{' ' + numReviews + ' reviews'}</span>
			) : (
				''
			)}
		</div>
	);
}
