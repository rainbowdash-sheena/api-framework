import { assert } from 'chai';
import CoreApi from '../src/http/CoreApi';
import { allure } from 'allure-mocha/runtime';
import { Cat, allCats } from '../@types/common';
import { AxiosResponse } from 'axios';




describe('Проверка удаления записи с котом', async () => {
    it('allure', async () => {

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
                console.info('шаг 1 🚀:', 'получен ответ на запрос GET /cats/all:\n', data);
                allure.attachment('attachment', data, 'application/json');
                return response;
            }
        );

        let flatCatCollection: Cat[] = [];
        listResponse.data.groups.forEach((group) => flatCatCollection = flatCatCollection.concat(group.cats))
        const randomCat = flatCatCollection[Math.floor(Math.random() * (flatCatCollection.length - 1))];
        const randomCatId = randomCat.id;


        console.info('шаг 2 🚀:', 'будем удалять кота с id:\n', randomCatId);
        const deleteResponse: AxiosResponse<Cat> = await allure.step(
            `выполнен запрос DELETE /cats/${randomCatId}/remove`,
            async () => {
                console.info('шаг 2 🚀:', `выполняем запрос DELETE /cats/${randomCatId}/remove`);
                const response = await CoreApi.removeCat(randomCatId);
                if (response.status !== 200) {
                    assert.fail(
                        `Произошла ошибка при удалении кота с id: ${randomCatId}`
                    );
                }
                const data = JSON.stringify(response.data, null, 2);
                console.info('шаг 2 🚀:', `получен ответ на запрос DELETE /cats/${randomCatId}/remove:\n`, data);
                allure.attachment('attachment', data, 'application/json');
                return response;
            }
        );

        if (deleteResponse.data.id !== randomCatId) {
            assert.fail(
                `Произошла ошибка. Id удаляемого кота: ${randomCatId} не соответствует Id удаленного кота: ${deleteResponse.data.id}`
            );
        } else {
            await allure.step(
                'выполнена проверка соответствия значения удаленного кота из запроса с ожидаемым',
                () => {
                    console.info('выполнена проверка соответствия значения удаленного кота из запроса с ожидаемым');
                    allure.attachment('actual', deleteResponse.data.id.toString(), 'text/plain');
                    allure.attachment('expected', randomCatId.toString(), 'text/plain');
                }
            );
        }



        console.info('шаг 3 🚀:', 'будем искать удаленного кота с id:\n', randomCatId);
        const getDeletedCatResponse: AxiosResponse<Cat> = await allure.step(
            `выполнен запрос GET /get-by-id c параметром ${randomCatId}`,
            async () => {
                console.info('шаг 3 🚀:', 'выполняется запрос GET /get-by-id c параметром ', randomCatId);
                const response = await CoreApi.getCatById(randomCatId);
                console.log(response);
                if (response.status == 200) {
                    assert.fail(
                        `Произошла ошибка. Кот с id: ${randomCatId} не был удален из системы!`
                    );
                }
                const data = JSON.stringify(response.data, null, 2);
                console.info('шаг 3 🚀:', 'получен ответ на запрос GET /get-by-id c параметром', randomCatId, ':\n', data);
                allure.attachment('attachment', data, 'application/json');
                return response;
            }
        );

        await allure.step(
            'выполнена проверка на отсутствие удаленного кота в базе данных',
            () => {
                assert.ok(getDeletedCatResponse.status === 404);
                console.info('Выполнена проверка на отсутствие удаленного кота в базе данных. Тест успешный!');
            }
        );

    });
});
