export const config = {
    hash: {
        exampleSize: 30, // Размер картинки - NxN, N^2 пикселей
        exampleDiff: Math.ceil((60^2) * 0.01), // Кол-во пикселей, которые могут расходиться из исходных N^2 (кажется надо 0.5%)
        exampleFuzz: 10, //
    }
};
