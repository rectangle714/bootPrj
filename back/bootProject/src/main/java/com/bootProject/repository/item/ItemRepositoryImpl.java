package com.bootProject.repository.item;

import com.bootProject.entity.Item;
import com.bootProject.entity.QItem;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class ItemRepositoryImpl implements ItemRepositoryCustom{
    private final JPAQueryFactory queryFactory;

    @Override
    public List<Item> findListAll() {
        QItem item = QItem.item;
        return queryFactory
                .selectFrom(item)
                .fetch();
    }
}