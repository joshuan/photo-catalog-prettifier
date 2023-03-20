const EXAMPLE_SIZE = 8;

export const config = {
    hash: {
        exampleSize: EXAMPLE_SIZE, // Размер картинки - NxN, N^2 пикселей
        exampleDiff: Math.ceil((EXAMPLE_SIZE^2) * 0.005), // Кол-во пикселей, которые могут расходиться из исходных N^2 (кажется надо 0.5%)
        exampleFuzz: 10, //
    }
};
