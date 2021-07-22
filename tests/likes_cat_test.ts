import { assert } from 'chai';
import CoreApi from '../src/http/CoreApi';
import LikeApi from '../src/http/LikeApi';
import { allure } from 'allure-mocha/runtime';
import { Cat, allCats } from '../@types/common';
import { AxiosResponse } from 'axios';




describe('Проверка лайков/дизлайков кота', async () => {
    it('лайки', async () => {
        console.info('ТЕСТ НА ЛАЙКИ');
        console.info('шаг 1 🚀:', 'будем искать случайного кота');
        const listResponse: AxiosResponse<allCats> = await allure.step(
            `выполнен запрос GET /cats/all`,
            async () => {
                console.info('шаг 1 🚀:', 'выполняем запрос GET /cats/all');
                const response = await CoreApi.getAllCats();
                if (response.status !== 200) {
                    assert.fail(
                        `Произошла ошибка при запросе списка котов`
                    );
                }
                const data = JSON.stringify(response.data, null, 2);
                console.info('шаг 1 🚀:', 'получен ответ на запрос GET /cats/all');
                allure.attachment('attachment', data, 'application/json');
                return response;
            }
        );

        let flatCatCollection: Cat[] = [];
        listResponse.data.groups.forEach((group) => flatCatCollection = flatCatCollection.concat(group.cats))
        const randomCat = flatCatCollection[Math.floor(Math.random() * (flatCatCollection.length - 1))];
        const randomCatId = randomCat.id;
        const randomCatLikesBefore = randomCat.likes;
        const likesDelta = 5;

        await allure.step('выбрали случайного кота', () => {
            allure.attachment('attachment', JSON.stringify(randomCat), 'application/json');
            console.info('шаг 2 🚀:', `выбрали кота с id=${randomCatId} и количеством лайков: ${randomCatLikesBefore}`);
        })


        console.info('шаг 3 🚀:', `накрутим +${likesDelta} лайков коту с id:${randomCatId}`);
        await allure.step(
            `выполняем ${likesDelta} раз запросы POST /cats/${randomCatId}/likes`,
            async () => {
                console.info('шаг 3 🚀:', `выполняем ${likesDelta} раз запросы POST /cats/${randomCatId}/likes`);

                for(let i = 1; i <= likesDelta; i++) {
                    const response = await LikeApi.likes(randomCatId, {like: true, dislike: false});
                    if (response.status !== 200) {
                        assert.fail(
                            `Произошла ошибка при добавлении лайка коту с id: ${randomCatId}`
                        );
                    }
                    const data = JSON.stringify(response.data, null, 2);
                    allure.attachment(`attachment_${i}`, data, 'application/json');
                }
                console.info('шаг 3 🚀:', `успешно выполнены ${likesDelta} раз запросы POST /cats/${randomCatId}/likes`);
            }
        );



        console.info('шаг 4 🚀:', 'запрашиваем актуальный стейт кота с id:', randomCatId);
        const getCatResponse: AxiosResponse<{cat: Cat}> = await allure.step(
            `выполнен запрос GET /get-by-id c параметром ${randomCatId}`,
            async () => {
                console.info('шаг 4 🚀:', 'выполняется запрос GET /get-by-id c параметром ', randomCatId);
                const response = await CoreApi.getCatById(randomCatId);

                if (response.status !== 200) {
                    assert.fail(
                        `Произошла ошибка при запросе данных по коту с id: ${randomCatId}`
                    );
                }
                const data = JSON.stringify(response.data, null, 2);
                console.info('шаг 4 🚀:', 'получен ответ на запрос GET /get-by-id c параметром', randomCatId);
                allure.attachment('attachment', data, 'application/json');
                return response;
            }
        );

        await allure.step(
            'выполнена проверка на соответствие количества лайков',
            () => {
                const likesExpected = randomCatLikesBefore + likesDelta;
                assert.ok(getCatResponse.data.cat.likes === likesExpected);
                console.info('Выполнена проверка на соответствие количества лайков. Тест успешный!\n');
            }
        );

    });

    it('дизлайки', async () => {
        console.info('ТЕСТ НА ДИЗЛАЙКИ');
        console.info('шаг 1 🚀:', 'будем искать случайного кота');
        const listResponse: AxiosResponse<allCats> = await allure.step(
            `выполнен запрос GET /cats/all`,
            async () => {
                console.info('шаг 1 🚀:', 'выполняем запрос GET /cats/all');
                const response = await CoreApi.getAllCats();
                if (response.status !== 200) {
                    assert.fail(
                        `Произошла ошибка при запросе списка котов`
                    );
                }
                const data = JSON.stringify(response.data, null, 2);
                console.info('шаг 1 🚀:', 'получен ответ на запрос GET /cats/all');
                allure.attachment('attachment', data, 'application/json');
                return response;
            }
        );

        let flatCatCollection: Cat[] = [];
        listResponse.data.groups.forEach((group) => flatCatCollection = flatCatCollection.concat(group.cats))
        const randomCat = flatCatCollection[Math.floor(Math.random() * (flatCatCollection.length - 1))];
        const randomCatId = randomCat.id;
        const randomCatDislikesBefore = randomCat.dislikes;
        const dislikesDelta = 10;

        await allure.step('выбрали случайного кота', () => {
            allure.attachment('attachment', JSON.stringify(randomCat), 'application/json');
            console.info('шаг 2 🚀:', `выбрали кота с id=${randomCatId} и количеством дизлайков: ${randomCatDislikesBefore}`);
        })


        console.info('шаг 3 🚀:', `накрутим +${dislikesDelta} дизлайков коту с id:${randomCatId}`);
        await allure.step(
            `выполняем ${dislikesDelta} раз запросы POST /cats/${randomCatId}/likes`,
            async () => {
                console.info('шаг 3 🚀:', `выполняем ${dislikesDelta} раз запросы POST /cats/${randomCatId}/likes`);

                for(let i = 1; i <= dislikesDelta; i++) {
                    const response = await LikeApi.likes(randomCatId, {like: false, dislike: true});
                    if (response.status !== 200) {
                        assert.fail(
                            `Произошла ошибка при добавлении дизлайка коту с id: ${randomCatId}`
                        );
                    }
                    const data = JSON.stringify(response.data, null, 2);
                    allure.attachment(`attachment_${i}`, data, 'application/json');
                }
                console.info('шаг 3 🚀:', `успешно выполнены ${dislikesDelta} раз запросы POST /cats/${randomCatId}/likes`);
            }
        );



        console.info('шаг 4 🚀:', 'запрашиваем актуальный стейт кота с id:', randomCatId);
        const getCatResponse: AxiosResponse<{cat: Cat}> = await allure.step(
            `выполнен запрос GET /get-by-id c параметром ${randomCatId}`,
            async () => {
                console.info('шаг 4 🚀:', 'выполняется запрос GET /get-by-id c параметром ', randomCatId);
                const response = await CoreApi.getCatById(randomCatId);

                if (response.status !== 200) {
                    assert.fail(
                        `Произошла ошибка при запросе данных по коту с id: ${randomCatId}`
                    );
                }
                const data = JSON.stringify(response.data, null, 2);
                console.info('шаг 4 🚀:', 'получен ответ на запрос GET /get-by-id c параметром', randomCatId);
                allure.attachment('attachment', data, 'application/json');
                return response;
            }
        );

        await allure.step(
            'выполнена проверка на соответствие количества дизлайков',
            () => {
                const dislikesExpected = randomCatDislikesBefore + dislikesDelta;
                assert.ok(getCatResponse.data.cat.dislikes === dislikesExpected);
                console.info('Выполнена проверка на соответствие количества дизлайков. Тест успешный!\n');
            }
        );

    });
});
