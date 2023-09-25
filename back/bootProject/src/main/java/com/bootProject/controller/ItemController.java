package com.bootProject.controller;

import com.bootProject.entity.Item;
import com.bootProject.service.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/item")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @RequestMapping("/save")
    public ResponseEntity<Void> saveItem(Item item) {
        if(item != null) {
            itemService.saveItem(item);
        }
        return ResponseEntity.ok().build();
    }

    @RequestMapping("/findAll")
    public ResponseEntity<List<Item>> saveItem() {
        List<Item> result = itemService.findAllItem();

        return ResponseEntity.ok(result);
    }

}