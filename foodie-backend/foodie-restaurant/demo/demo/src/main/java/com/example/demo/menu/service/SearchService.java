package com.example.demo.menu.service;



import com.example.demo.menu.dto.SearchItemDTO;

import java.util.List;

public interface SearchService {
    List<SearchItemDTO> search(
            String query,
            Boolean veg,
            String category,
            Double minRating,
            String sort,
            String order,
            int page,
            int size
    );

}

