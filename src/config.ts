export const config = {
    hash: {
        exampleSize: 10, // Размер картинки - NxN, N^2 пикселей
        exampleDiff: Math.ceil((10^2) * 0.01), // Кол-во пикселей, которые могут расходиться из исходных N^2 (кажется надо 0.5%)
        exampleFuzz: 10, //
    }
};
